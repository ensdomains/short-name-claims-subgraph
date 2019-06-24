import { store, ByteArray } from '@graphprotocol/graph-ts'
import {
  ClaimSubmitted as ClaimSubmittedEvent,
  ClaimStatusChanged as ClaimStatusChangedEvent,
  Contract as ShortNameClaims,
} from "../generated/Contract/Contract"
import { Claim } from "../generated/schema"

var ENUM_MAP = new Map<number,string>()
ENUM_MAP.set(0, 'PENDING')
ENUM_MAP.set(1, 'APPROVED')
ENUM_MAP.set(2, 'DECLINED')
ENUM_MAP.set(3, 'WITHDRAWN')

export function handleClaimSubmitted(event: ClaimSubmittedEvent): void {
  let claims = ShortNameClaims.bind(event.address)
  let claimId = claims.computeClaimId(event.params.claimed, event.params.dnsname, event.params.claimant, event.params.email)
  let entity = new Claim(claimId.toHexString())

  entity.name = event.params.claimed
  entity.email = event.params.email
  entity.dnsName = decodeDNSName(event.params.dnsname)
  entity.paid = event.params.paid
  entity.owner = event.params.claimant
  entity.status = 'PENDING'
  entity.submittedAt = event.block.timestamp
  entity.save()
}

export function handleClaimStatusChanged(event: ClaimStatusChangedEvent): void {
  let claim = Claim.load(event.params.claimId.toHexString())
  claim.status = ENUM_MAP.get(event.params.status)
  claim.processedAt = event.block.timestamp
  claim.save()
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
