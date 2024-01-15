import { Patch } from '@ls1intum/apollon'
import { Operation, ReplaceOperation } from 'fast-json-patch'


export type SignedReplaceOperation = ReplaceOperation<any> & { hash: string };
export type SignedOperation = Exclude<Operation, ReplaceOperation<any>> | SignedReplaceOperation;
export type SignedPatch = SignedOperation[];

function isReplaceOperation(operation: Operation): operation is ReplaceOperation<any> {
  return operation.op === 'replace';
}

function isSignedOperation(operation: Operation): operation is SignedOperation {
  return !isReplaceOperation(operation) || 'hash' in operation;
}

export class PatchVerifier {
  private waitlist: { [address: string]: string } = {};

  public signOperation(operation: Operation): SignedOperation {
    if (isReplaceOperation(operation)) {
      const hash = Math.random().toString(36).substring(2, 15);
      const path = operation.path;
      this.waitlist[path] = hash;

      return { ...operation, hash };
    } else {
      return operation;
    }
  }

  public sign(patch: Patch) {
    return patch.map(op => this.signOperation(op));
  }

  public isVerifiedOperation(operation: Operation): boolean {
    if (
      isReplaceOperation(operation)
      && isSignedOperation(operation)
      && operation.path in this.waitlist
    ) {
      if (this.waitlist[operation.path] === operation.hash) {
        delete this.waitlist[operation.path];
      }

      return false;
    } else {
      return true;
    }
  }

  public verified(patch: Patch): Patch {
    return patch.filter(op => this.isVerifiedOperation(op));
  }
}
