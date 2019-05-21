import React from 'react'
import { Field } from 'formik'
import { Input } from 'design/atoms/Input'

interface Props {
  hidden?: boolean
}

const PasswordField: React.SFC<Props> = ({ hidden }) => {
  return (
    <Field
      name="password"
      render={({ field }) => (
        <Input
          {...field}
          name="password"
          type="password"
          placeholder="Private Key"
          autoComplete="current-password'"
          aria-hidden={hidden}
          tabIndex={hidden ? -1 : 0}
          spellCheck="false"
        />
      )}
    />
  )
}

export default PasswordField
