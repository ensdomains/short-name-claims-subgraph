import {
  ClaimSubmitted as ClaimSubmittedEvent,
  ClaimApproved as ClaimApprovedEvent,
  ClaimDeclined as ClaimDeclinedEvent,
  OwnershipTransferred as OwnershipTransferredEvent
} from "../generated/Contract/Contract"
import {
  ClaimSubmitted,
  ClaimApproved,
  ClaimDeclined,
  OwnershipTransferred
} from "../generated/schema"

export function handleClaimSubmitted(event: ClaimSubmittedEvent): void {
  let entity = new ClaimSubmitted(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.claimed = event.params.claimed
  entity.dnsname = event.params.dnsname
  entity.paid = event.params.paid
  entity.save()
}

export function handleClaimApproved(event: ClaimApprovedEvent): void {
  let entity = new ClaimApproved(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.claimId = event.params.claimId
  entity.save()
}

export function handleClaimDeclined(event: ClaimDeclinedEvent): void {
  let entity = new ClaimDeclined(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.claimId = event.params.claimId
  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}
