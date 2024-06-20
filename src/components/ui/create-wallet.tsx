'use client'
import { useCallback } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export const CreateWallet = () => {
	const account = useAccount()
	const { connectors, connect, status, error } = useConnect()
	const { disconnect } = useDisconnect()

	const createWallet = useCallback(() => {
		console.log('hey')
		const coinbaseWalletConnector = connectors.find(
			(connector) => connector.id === 'coinbaseWalletSDK'
		)

		if (coinbaseWalletConnector) {
			connect({ connector: coinbaseWalletConnector })
		}
	}, [connectors, connect])

	return (
		// <button
		// 	className='connect-button rounded-full hover:text-white'
		// 	onClick={createWallet}
		// >
		// 	<p>Connect Wallet</p>
		// </button>
		<>
			{JSON.stringify(account.address)}
			{connectors.map((connector) => (
				<button
					key={connector.uid}
					onClick={() => connect({ connector })}
					type='button'
				>
					{connector.name}
				</button>
			))}
			<div>{status}</div>
		</>
	)
}

// const buttonStyles = {
// 	background: 'transparent',
// 	border: '1px solid transparent',
// 	// boxSizing: 'border-box',
// 	display: 'flex',
// 	alignItems: 'center',
// 	justifyContent: 'space-between',
// 	width: 200,
// 	fontFamily: 'Arial, sans-serif',
// 	fontWeight: 'bold',
// 	fontSize: 18,
// 	backgroundColor: '#0052FF',
// 	paddingLeft: 15,
// 	paddingRight: 30,
// 	borderRadius: 10,
// 	cursor: 'pointer',
// }
