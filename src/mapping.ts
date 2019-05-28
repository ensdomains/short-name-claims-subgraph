import { store, ByteArray } from '@graphprotocol/graph-ts'
import {
  ClaimSubmitted as ClaimSubmittedEvent,
  ClaimApproved as ClaimApprovedEvent,
  ClaimDeclined as ClaimDeclinedEvent,
  Contract as ShortNameClaims,
} from "../generated/Contract/Contract"
import { Claim } from "../generated/schema"

export function handleClaimSubmitted(event: ClaimSubmittedEvent): void {
  let claims = ShortNameClaims.bind(event.address)
  let claimId = claims.computeClaimId(event.params.claimed, event.params.dnsname).toHexString()
  let entity = new Claim(claimId)

  entity.name = event.params.claimed
  entity.dnsName = decodeDNSName(event.params.dnsname)
  entity.paid = event.params.paid
  entity.save()
}

export function handleClaimApproved(event: ClaimApprovedEvent): void {
  store.remove('Claim', event.params.claimId.toHexString())
}

export function handleClaimDeclined(event: ClaimDeclinedEvent): void {
  store.remove('Claim', event.params.claimId.toHexString())
}

function decodeDNSName(val: ByteArray): string {
  let parts = new Array<string>()
  let offset = 0
  while(true) {
    let len = val[offset]
    if(len == 0) break;
    let decoded = ''
    for(var i = offset + 1; i < offset + len + 1; i++) {
      decoded = decoded + String.fromCharCode(val[i])
    }
    offset += len + 1
    parts.push(decoded)
  }
  return parts.join('.')
}
