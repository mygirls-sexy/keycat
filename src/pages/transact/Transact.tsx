import React, { useCallback, useMemo } from 'react'
import TransactPayload from './TransactPayload'
import Submit from 'design/moles/fields/Submit'
import { getSearchParams } from 'utils/utils'
import AccountField from 'design/moles/fields/AccountField'
import PasswordField from 'design/moles/fields/PasswordField'
import CardLayout from 'design/layouts/CardLayout'
import { useTransact } from 'hooks/transactHooks'
import { Fields } from 'design/atoms/Input'
import FieldError from 'design/moles/fields/FieldError'
import { Form } from 'design/moles/form/Form'
import { dashCaseToCamelCase } from 'utils/stringUtils'
import TransactMeta from './TransactMeta'
import JsonViewer from 'design/moles/JsonViewer'
import { useStore } from 'store/store'

interface Props {
  path: string
}

const Transact: React.SFC<Props> = ({ path }) => {
  const { account, payload } = getSearchParams()
  const {
    config: {
      blockchain: { plugin },
    },
  } = useStore()

  const { mode, title } = useMemo(() => {
    const mode = dashCaseToCamelCase(path.slice(1))

    const titles = {
      sign: 'Sign Transaction',
      signTransaction: 'Sign Transaction',
      signArbitraryData: 'Sign arbitrary data',
      transact: 'Sign Transaction',
    }

    return {
      mode,
      title: titles[mode],
    }
  }, [])

  const transact = useTransact(mode)

  const params = useMemo(() => {
    const args = atob(decodeURIComponent(payload as string))
    return JSON.parse(args)
  }, [])

  const Payload = useMemo(() => {
    const args = atob(decodeURIComponent(payload as string))
    const data = JSON.parse(args)

    if (mode === 'signArbitraryData' || plugin !== 'eos') {
      return <JsonViewer src={data} />
    }

    if (mode === 'signTransaction') {
      return <TransactPayload payload={data[0]} />
    }

    return <TransactPayload payload={data[0]} />
  }, [])

  const handleSubmit = useCallback(({ values, ...formProps }) => {
    transact.transact({
      values: {
        params,
        ...values,
      },
      ...formProps,
    })
  }, [])

  return (
    <CardLayout title={title}>
      <TransactMeta account={account} />
      <Form method="post" noValidate onSubmit={handleSubmit}>
        <Fields>
          {Payload}
          <AccountField defaultValue={account as string} hidden />
          <PasswordField hidden />
          <FieldError name="account" />
          <FieldError name="password" />
        </Fields>
        <Submit />
      </Form>
    </CardLayout>
  )
}

export default Transact
