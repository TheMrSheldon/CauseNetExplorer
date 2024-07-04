import { Box, Button, Divider, Drawer, InputBase, Paper, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as React from 'react';


const drawerWidth = 500;

interface SideBarProps {
	open: boolean,
	onClose: () => void,

	onSearch: (query: string) => string[] | null,
	addNodeAction: (node: string) => void,
	children?: React.ReactNode
}

const SideBar: React.FC<SideBarProps> = (props: SideBarProps) => {
	const [searchInput, setSearchInput] = React.useState<string>("");

	return (
		<Drawer
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: drawerWidth,
					boxSizing: 'border-box',
				},
			}}
			variant="persistent"
			anchor="right"
			open={props.open}
			onClose={props.onClose}
		>
			<Box display="flex" flexDirection="column">
				<Typography variant="h5">Search</Typography>
				<Paper
					component="form"
					sx={{ p: '0px 0px', m: 1, display: 'flex', alignItems: 'center' }}
					onSubmit={(e => {e.preventDefault(); props.addNodeAction(searchInput); })}
					>
					<InputBase
						id = "conceptsearch"
						sx={{ ml: 2, flex: 1 }}
						placeholder="Find or Add Concept"
						inputProps={{ 'aria-label': 'find or add concept' }}
						value={searchInput}
						onChange={e => setSearchInput(e.target.value)}
					/>
					<Button variant="contained" sx={{ p: '10px 0px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} aria-label="search" type="submit">
						<SearchIcon />
					</Button>
				</Paper>
			</Box>
			<Divider/>
			{props.children}
		</Drawer>
	);
}
export default SideBar;