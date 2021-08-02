import { Planter, RegularTree, Tree, UpdateTree } from '../../generated/schema';
import { AddTreeCall, AssignTreeToPlanterCall, PlantRejected, PlantVerified, RegularTreePlanted, TreeFactory as TreeFactoryContract, TreeFactory__regularTreesResult, TreeFactory__treeDataResult, TreeFactory__updateTreesResult, TreePlanted } from '../../generated/TreeFactory/TreeFactory';
import { Address, BigInt } from '@graphprotocol/graph-ts';
import { COUNTER_ID, getCount, ZERO_ADDRESS } from '../helpers';

/**
 * 
 struct TreeStruct {
        address planterId;
        uint256 treeType;
        uint16 mintStatus;
        uint16 countryCode;
        uint32 provideStatus;
        uint64 treeStatus;
        uint64 plantDate;
        uint64 birthDate;
        string treeSpecs;
    }


     struct UpdateTree {
        string updateSpecs;
        uint64 updateStatus;
    }

    struct RegularTree {
        uint64 birthDate;
        uint64 plantDate;
        uint64 countryCode;
        uint64 otherData;
        address planterAddress;
        string treeSpecs;
    }
 */
function setRegularTreeData(rtree: RegularTree, c_rtree: TreeFactory__regularTreesResult): void {
    rtree.birthDate = c_rtree.value0 as BigInt;
    rtree.plantDate = c_rtree.value1 as BigInt;
    rtree.countryCode = c_rtree.value3 as BigInt;


}
function setTreeData(tree: Tree, c_tree: TreeFactory__treeDataResult): void {
    tree.planter = c_tree.value0.toHexString();
    tree.treeType = c_tree.value1 as BigInt;
    tree.mintStatus = c_tree.value2 as BigInt;
    tree.countryCode = c_tree.value3 as BigInt;
    tree.treeStatus = c_tree.value4 as BigInt;
    tree.plantDate = c_tree.value5 as BigInt;
    tree.provideStatus = c_tree.value6 as BigInt;
    tree.birthDate = c_tree.value7 as BigInt;
    tree.treeSpecs = c_tree.value8.toString();
}
function setUpTreeData(uptree: UpdateTree, c_uptree: TreeFactory__updateTreesResult): void {
    uptree.treeSpecs = c_uptree.value0.toString();
    uptree.status = c_uptree.value1 as BigInt;
}
function copyTree(t1: Tree, t2: Tree): void {
    t1.birthDate = t2.birthDate;
    t1.countryCode = t2.countryCode;
    t1.mintStatus = t2.mintStatus;
    t1.owner = t2.owner;
    t1.treeType = t2.treeType;
    t1.treeStatus = t2.treeStatus;
    t1.treeSpecs = t2.treeSpecs;
    t1.treeAttribute = t2.treeAttribute;
    t1.provideStatus = t2.provideStatus;
    t1.planter = t2.planter;
    t1.plantDate = t2.plantDate;
}
function upsertTree(tree: Tree): void {
    const t = Tree.load(tree.id);
    if (t !== null) {
        copyTree(t, tree);
        t.save();
    } else {
        tree.save();
    }
}
export function handleTreePlanted(event: TreePlanted): void {
    let treeFactoryContract = TreeFactoryContract.bind(event.address);
    // let c_tree = treeFactoryContract.treeData(event.params.treeId);
    // let tree = new Tree(event.params.treeId.toHexString());
    // setTreeData(tree, c_tree);
    // tree.save();
    let treeId = event.params.treeId.toHexString();
    let tree = Tree.load(treeId);
    let c_tree = treeFactoryContract.treeData(BigInt.fromString(treeId));
    let c_uptree = treeFactoryContract.updateTrees(BigInt.fromString(treeId));
    setTreeData(tree, c_tree);
    tree.treeSpecs = c_uptree.value0;
    upsertTree(tree);
    let uptree = new UpdateTree(getCount(COUNTER_ID, 'updateSpec', true).toHexString());
    uptree.treeSpecs = c_uptree.value0;
    uptree.tree = treeId;
    uptree.updateDate = event.block.timestamp;
    uptree.status = c_uptree.value1;
    uptree.type = true;
    tree.treeStatus = BigInt.fromI32(3);
    uptree.save();
    tree.save();
    let planter = Planter.load(tree.planter);
    planter.plantedCount = planter.plantedCount.plus(BigInt.fromI32(1));
    if (planter.plantedCount.equals(planter.capacity)) {
        planter.status = BigInt.fromI32(2);
    }
    planter.save();
}

export function handleAddTree(call: AddTreeCall): void {
    const tree = new Tree(call.inputs._treeId.toHexString());
    tree.treeStatus = BigInt.fromI32(2);
    tree.treeSpecs = call.inputs._treeDescription;
    tree.save();
}

export function handleassignTreeToPlanter(call: AssignTreeToPlanterCall): void {
    const tree = Tree.load(call.inputs._treeId.toHexString());
    // const planter = Planter.load(call.inputs._treeId.toHexString());
    tree.planter = call.inputs._treeId.toHexString();
    tree.save();
}

export function handlePlantVerified(event: PlantVerified): void {
    const tree = Tree.load(event.params.treeId.toHexString());
    let treeFactoryContract = TreeFactoryContract.bind(event.address);
    let c_tree = treeFactoryContract.treeData(event.params.treeId);
    setTreeData(tree, c_tree);
    tree.treeStatus = BigInt.fromI32(4);
    tree.save();
}

export function handlePlantRejected(event: PlantRejected): void {
    const tree = Tree.load(event.params.treeId.toHexString());
    const planter = Planter.load(tree.planter);
    if (planter) {
        planter.plantedCount = planter.plantedCount.minus(BigInt.fromI32(1));
        if (planter.status.equals(BigInt.fromI32(2))) {
            planter.status = BigInt.fromI32(1);
        }
        planter.save();
    }
    tree.treeStatus = BigInt.fromI32(2);
    tree.save();
}

export function handleRegularTreePlanted(event: RegularTreePlanted): void {
    const rtree = new RegularTree(event.params.treeId.toHexString());
    let treeFactoryContract = TreeFactoryContract.bind(event.address);
    let c_rtree = treeFactoryContract.regularTrees(event.params.treeId);

}