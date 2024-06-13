'use client';

import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, mappedProjects, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

// -------- @types

import { FileData } from '../../../../components/file-upload/fileUploadButton';

// -------- @types

// import AppWidget from '../app-widget';
// import AppWelcome from '../app-welcome';
// import AppFeatured from '../app-featured';
// import AppNewInvoice from '../app-new-invoice';
// import AppTopAuthors from '../app-top-authors';
// import AppTopRelated from '../app-top-related';
// import AppAreaInstalled from '../app-area-installed';
// import AppWidgetSummary from '../app-widget-summary';
// import AppCurrentDownload from '../app-current-download';
// import AppTopInstalledCountries from '../app-top-installed-countries';
import AppAreaUPC from '../app-area-upc';
import FileUploadButton from '../../../../components/file-upload/fileUploadButton'

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  const settings = useSettingsContext();

  const [fileData, setFileData] = useState<FileData | null>(null);
  const [projectData, setProjectData] = useState([]);

  useEffect(() => {
    const loadData = () => {
      const storedData = localStorage.getItem('uploadedData');
      if (storedData) {
        setFileData(JSON.parse(storedData));

        console.log(fileData)
      }
    };

    loadData();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'uploadedData') {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
    
  }, []);

  useEffect(() => {
    const geoJsonData = localStorage.getItem('uploadedData');
    if (geoJsonData) {
      const parsedData = JSON.parse(geoJsonData);
      const mappedProjects = parsedData.features.map((feature: { properties: any; }) => {
        const properties = feature.properties;
        return {
          Project_No: properties.Project_No || "-",
          Proj_Name: properties.Proj_Name || "-",
          Tenure_Nam: properties.Tenure_Nam || "-",
          Land_type: properties.Land_type || "-",
          Original_N: properties.Original_N || "-",
          Province: properties.Province || "-",
          Municipali: properties.Municipali || "-",
          Barangays: properties.Barangays || "-",
          PO_Chairma: properties.PO_Chairma || "-",
          Contact_Nu: properties.Contact_Nu || "-",
          CBFMA_No_: properties.CBFMA_No_ || "-",
          Date_Issue: properties.Date_Issue || "-",
          Expiry_Dat: properties.Expiry_Dat || "-",
          Area_ha: properties.Area_ha !== undefined ? properties.Area_ha : "-",
          Status: properties.Status || "-",
        };
      });
      setProjectData(mappedProjects);
    }
  }, []);
  

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        {/* <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.displayName}`}
            description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
            img={<SeoIllustration />}
            action={
              <Button variant="contained" color="primary">
                Go Now
              </Button>
            }
          />
        </Grid> */}

        {/* <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid> */}

        {/* <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Active Users"
            percent={2.6}
            total={18765}
            chart={{
              series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Installed"
            percent={0.2}
            total={4876}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Downloads"
            percent={-0.1}
            total={678}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AppCurrentDownload
            title="Current Download"
            chart={{
              series: [
                { label: 'Mac', value: 12244 },
                { label: 'Window', value: 53345 },
                { label: 'iOS', value: 44313 },
                { label: 'Android', value: 78343 },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Area Installed"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  year: '2019',
                  data: [
                    {
                      name: 'Asia',
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: 'America',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
                {
                  year: '2020',
                  data: [
                    {
                      name: 'Asia',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: 'America',
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid> */}

        <Grid xs={12} lg={12}>
          <FileUploadButton />
          {/* {fileData ? <pre>{JSON.stringify(fileData, null, 2)}</pre> : <p>No data uploaded</p>} */}
          <AppAreaUPC
            title="UPC Area"
            tableData={projectData}
            tableLabels={[
              { id: 'Project_No', label: 'Project No' },
              { id: 'Proj_Name', label: 'Project Name' },
              { id: 'Tenure_Nam', label: 'Tenure Name' },
              { id: 'Land_type', label: 'Land Type' },
              { id: 'Original_N', label: 'Original Name' },
              { id: 'Province', label: 'Province' },
              { id: 'Municipali', label: 'Municipality' },
              { id: 'Barangays', label: 'Barangays' },
              { id: 'PO_Chairma', label: 'PO Chairman' },
              { id: 'Contact_Nu', label: 'Contact Number' },
              { id: 'CBFMA_No_', label: 'CBFMA No' },
              { id: 'Date_Issue', label: 'Date Issued' },
              { id: 'Expiry_Dat', label: 'Expiry Date' },
              { id: 'Area_ha', label: 'Area (ha)' },
              { id: 'Status', label: 'Status' },
              { id: '', label: '' },
            ]}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AppTopRelated title="Top Related Applications" list={_appRelated} />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title="Top Authors" list={_appAuthors} />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <Stack spacing={3}>
            <AppWidget
              title="Conversion"
              total={38566}
              icon="solar:user-rounded-bold"
              chart={{
                series: 48,
              }}
            />

            <AppWidget
              title="Applications"
              total={55566}
              icon="fluent:mail-24-filled"
              color="info"
              chart={{
                series: 75,
              }}
            />
          </Stack>
        </Grid> */}
      </Grid>
    </Container>
  );
}
