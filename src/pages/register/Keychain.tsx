import React from 'react'
import styled from 'styled-components'
import CardLayout from 'design/layouts/CardLayout';
import Submit from 'design/moles/fields/Submit';
import { sendMessage } from 'api/message';
import { useStore } from 'store/store';
import { getSearchParams } from 'utils/utils';

interface Props {
  path: string
}

const ImgContainer = styled.div`
  padding: var(--padding-x);
  img {
    width: 100%;
    height: 240px;
    object-fit: contain;
    object-position: center;
  }
`

const Desc = styled.div`
  font-size: 12px;
  color: #777;
`

const Keychain: React.SFC<Props> = () => {
  const account = getSearchParams().get('account')
  const { config: { client } } = useStore()

  const handleClick = () => {
    sendMessage('signin', { data: { account }}, client)
  }

  return (
    <CardLayout title="Save your Account to Keychain">
      <ImgContainer>
        <img src="/images/keychain.png" />
      </ImgContainer>
      <Submit
        help="keychain"
        onClick={handleClick}
      />
    </CardLayout>
  )
}

export default Keychain