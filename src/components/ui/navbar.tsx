import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from './navigation-menu'
import { Logo } from './logo'
import { Button } from './button'
import Link from 'next/link'
import { toast, ToastContainer } from 'react-toastify'
import { useAccount } from 'wagmi'

export const Navbar = () => {
	const account = useAccount()
	type NavLink = {
		title: string
		path: string
	}

	const navlinks: NavLink[] = [
		{
			title: 'Home',
			path: 'https://myriadflow.com',
		},
		{
			title: 'Discover',
			path: 'https://discover-two.vercel.app',
		},
		{
			title: 'Studio',
			path: 'https://studio-one-sigma.vercel.app/',
		},
		{
			title: 'WebXR',
			path: 'https://webxr-3d.vercel.app',
		},
	]

	const Notification = () => {
		if (!account.address) {
			toast.warning("Currently works with Metamask and Coinbase Wallet Extension. We are working on Smart Wallet functionality.", {
				position: 'top-left',
			}
			)
		}
	}

	return (
		<>
			<ToastContainer className="absolute top-10 right-0"/>
			<NavigationMenu className='nav max-w-screen flex items-center justify-between px-8 py-6'>
				<Logo />
				<NavigationMenuList className='flex gap-8 items-center text-white'>
					{navlinks.map((link, index) => (
						<Link href={link.path} key={index}>
							<NavigationMenuItem>{link.title}</NavigationMenuItem>
						</Link>
					))}
					<div onClick={() => Notification()}>
						<w3m-button />
					</div>
					{/* <w3m-button /> */}
				</NavigationMenuList>
			</NavigationMenu>
		</>

	)
}
