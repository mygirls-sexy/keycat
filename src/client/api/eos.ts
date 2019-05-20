import {
  Api,
  JsonRpc,
} from 'eosjs';

import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'; 

import ecc from 'eosjs-ecc'
import { networkPreset } from 'consts/consts';

const { nodes } = networkPreset['eos@junglenet']
const nodeos = {
  get: (api: (arg0: JsonRpc) => any) => (
    nodes.reduce(async (promise, cand, i) => {
      try {
        const res = await promise;
        return res;
      } catch (err) {
        if (i === (nodes.length)) {
          throw err
        } else {
          const rpc = new JsonRpc(cand)
          return api(rpc)
        }
      }
    }, Promise.reject())
  ),
}

export const getPublicKey = async (password) => {
  const publicKey = await ecc.privateToPublic(password)
  return publicKey
}

export const getAuthorization = async ({ account, password }) => {
  const publicKey = await getPublicKey(password)
  const { permissions } = await nodeos.get(rpc => rpc.get_account(account))
  const permission = permissions.reduce((res, p) => {
    if (res === 'actor') return res

    const { required_auth, perm_name: permission } = p
    const filtered = required_auth.keys.filter(({ key }) => key === publicKey)
    if (filtered.length === 0) {
      return res
    }

    return permission
  }, null)

  return {
    actor: account,
    permission,
  }
}

export const getAccounts = async (pk, nodes) => {
  const rpc = new JsonRpc(nodes[0]);
  const pub = await ecc.privateToPublic(pk)

  try {
    const { account_names: accounts } = await nodeos.get(rpc => rpc.history_get_key_accounts(pub))
    return accounts
  } catch (err) {
    console.error(err)
  }
}

export const isValidAccount = async ({ account, password }, nodes) => {
  try {
    const accounts = await getAccounts(password, nodes)
    return accounts.includes(account)
  } catch (err) {
    console.error(err)
    return false
  }
}

export const transact = async ({ account, payload, password }) => {
  const authorization = await getAuthorization({ password, account })
  const transaction = JSON.parse(payload)
  const actions = transaction.actions.map(a => ({
    ...a,
    authorization: [authorization],
  }))

  try {
    const response = await nodeos.get((rpc) => {
      const sig = new JsSignatureProvider([password]);
      const api = new Api({
        rpc,
        signatureProvider: sig,
      })

      return api.transact({ actions }, {
        blocksBehind: 3,
        expireSeconds: 30,
      })
    })

    return response
  } catch (err) {
    console.error(err)
  }

  // try {
  //   response.data = await api.transact(JSON.parse(payload), {
  //     blocksBehind: 3,
  //     expireSeconds: 30,
  //   });

  // } catch (err) {
  //   response.error = err.json;
  // }
  
  // return response;
}
