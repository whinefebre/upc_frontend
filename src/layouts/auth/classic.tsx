import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgGradient } from 'src/theme/css';
import { useAuthContext } from 'src/auth/hooks';
import { flexbox } from '@mui/system';

// Import logo using require to ensure it's a string
const Logo = '/assets/upc_assets/upc_logo.png';

// ----------------------------------------------------------------------

const METHODS = [
  {
    id: 'jwt',
    label: 'Jwt',
    path: paths.auth.jwt.login,
    icon: '/assets/icons/auth/ic_jwt.svg',
  },
  {
    id: 'firebase',
    label: 'Firebase',
    path: paths.auth.firebase.login,
    icon: '/assets/icons/auth/ic_firebase.svg',
  },
  {
    id: 'amplify',
    label: 'Amplify',
    path: paths.auth.amplify.login,
    icon: '/assets/icons/auth/ic_amplify.svg',
  },
  {
    id: 'auth0',
    label: 'Auth0',
    path: paths.auth.auth0.login,
    icon: '/assets/icons/auth/ic_auth0.svg',
  },
  {
    id: 'supabase',
    label: 'Supabase',
    path: paths.auth.supabase.login,
    icon: '/assets/icons/auth/ic_supabase.svg',
  },
];

type Props = {
  title?: string;
  image?: string;
  children: React.ReactNode;
};

export default function AuthClassicLayout({ children, image, title }: Props) {
  const { method } = useAuthContext();
  const theme = useTheme();
  // const mdUp = useResponsive('up', 'md');

  const renderLogo = (
    <Box
      component="img"
      src={Logo}
      sx={{
        height: '100px',
        padding: '20px',
      }}
    />
  );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: 480,
        px: { xs: 2, md: 8 },
        pt: { xs: 7, md: 10 },
        pb: { xs: 7, md: 0 },
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      spacing={0}
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center', }}>
        {title || 'Welcome'}
      </Typography>
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
        {title || 'To UPC Renewables'}
      </Typography>
    </Stack>
  );

  const renderTurbine = (
    <>
    <Typography variant="body2" color="text.secondary">
          {'https://www.upcrenewables.com/'}
    </Typography>

    </>
  );
 
  const renderFooter = (
    <Box
      component="footer"
      sx={{
        width: '100%',
        py: 3,
        px: 2,
        mt: 'auto',
        position: 'relative',
        textAlign: 'center',
      }}
    >

 
      <Box
        component="img"
        src="/assets/upc_assets/mountain_turb.png"
        sx={{
          width: '100%',
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}
      />
    </Box>
  );

  return (
    <Stack
      component="main"
      direction="column"
      flexGrow={1}
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: '100vh',
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94
          ),
          imgUrl: '/assets/background/overlay_2.jpg',
        }),
      }}
    >
            {renderLogo}
            {renderSection}
            {renderContent}
            {renderTurbine}
            {renderFooter}
    </Stack>
  );
}
