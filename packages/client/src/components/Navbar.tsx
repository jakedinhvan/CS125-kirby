import { Button, Box } from "@mui/material";
import Home from '@mui/icons-material/Home';
import Search from '@mui/icons-material/Search';
import VideoLibrary from '@mui/icons-material/VideoLibrary';
import { Link, useLocation } from 'react-router-dom';
import { Person2 } from "@mui/icons-material";

const Navbar = () => {
    const location = useLocation();

    const navButtonStyle = {
        height: '100%',
        width: 120, 
        borderRadius: 0,
        justifyContent: 'center',
    };

    const getButtonStyle = (path:string) => ({
        ...navButtonStyle,
        color: location.pathname === path ? 'white' : 'primary',
        textDecoration: 'none',
    });

    return (
      <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1100, backgroundColor: 'background.paper' }}>
          <Box sx={{ maxWidth: 1100, mx: 'auto', display: 'flex', alignItems: 'center', px: 2, gap: 1, height: 64 }}>
              <Button component={Link} to="/" sx={getButtonStyle('/')} startIcon={<Home />}>Home</Button>
              <Button component={Link} to="/browse" sx={getButtonStyle('/browse')} startIcon={<VideoLibrary />}>Browse</Button>
              <Button component={Link} to="/search" sx={getButtonStyle('/search')} startIcon={<Search />}>Search</Button>
              <Box sx={{ flexGrow: 1 }} />
              <Button component={Link} to="/profile" sx={getButtonStyle('/profile')} startIcon={<Person2 />}>Profile</Button>
          </Box>
      </Box>
    )
};

export default Navbar;