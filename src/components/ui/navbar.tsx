import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from './navigation-menu'
import { Logo } from './logo'
import { Button } from './button'
import Link from 'next/link'


export const Navbar = () => {
	type NavLink = {
		title: string
		path: string
	}

	const navlinks: NavLink[] = [
		{
			title: 'Home',
			path: '/',
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

	return (
		<NavigationMenu className='nav max-w-screen flex items-center justify-between px-8 py-6'>
			<Logo />
			<NavigationMenuList className='flex gap-8 items-center text-white'>
				{navlinks.map((link, index) => (
					<Link href={link.path} key={index}>
						<NavigationMenuItem>{link.title}</NavigationMenuItem>
					</Link>
				))}
				{/* <Button className='connect-button rounded-full hover:text-white'>
					Connect Wallet
				</Button> */}
				<w3m-button />
			</NavigationMenuList>
		</NavigationMenu>
	)
}
