import {Planter} from "../../generated/schema"
import {PlanterJoin, Planter as PlanterContract} from "../../generated/Planter/Planter"
import { log } from "@graphprotocol/graph-ts";
export function handlePlanterJoin(event:PlanterJoin): void{
    let planter = new Planter(event.params.planterId.toHex());
    planter.countryCode = "sdf";
    let planterContract = PlanterContract.bind(event.address);
    let pl = planterContract.planters(event.params.planterId);

    // let pl = Planter.load(event.params.planterId.toHex());
    // log.debug("Planter latitude is {}", [pl.latitude.toString()]);
    log.debug("Planter is {} {} {} {} {} {} {} {} ", [pl.value0.toString(), pl.value1.toString(), pl.value2.toString(), pl.value3.toString(), pl.value4.toString(), pl.value5.toString(), pl.value6.toString(), pl.value7.toString() ]);
    planter.save();
}

/**
 *   
  let contractTreeFactory = TreeFactory.bind(event.address)  
  theTree.planterRemainingBalance = contractTreeFactory.treeToPlanterRemainingBalance(event.params.treeId)
  theTree.ambassadorRemainingBalance = contractTreeFactory.treeToAmbassadorRemainingBalance(event.params.treeId)
  
 */