import React, { useState, useEffect } from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { GoogleMap, LoadScript, Polygon, Polyline, Marker, useJsApiLoader } from '@react-google-maps/api';
import proj4 from 'proj4';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Card, { CardProps } from '@mui/material/Card';
import TableContainer from '@mui/material/TableContainer';

import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type RowProps = {
  Project_No: string;
  Proj_Name: string;
  Tenure_Nam: string;
  Land_type: string;
  Original_N: string;
  Province: string | null;
  Municipali: string;
  Barangays: string;
  PO_Chairma: string;
  Contact_Nu: string;
  CBFMA_No_: string;
  Date_Issue: string;
  Expiry_Dat: string;
  Area_ha: number;
  Status: string;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableData: RowProps[];
  tableLabels: any;
}

// Define your projection source and target
const source = '+proj=utm +zone=51 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'; // EPSG:32651
const target = '+proj=longlat +datum=WGS84 +no_defs'; // WGS84 geographic coordinates

export default function AppAreaUPC({
  title,
  subheader,
  tableData,
  tableLabels,
  ...other
}: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 680 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row, index) => (
                <AppAreaLocation key={index} row={row} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
        >
          View All
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type AppNewInvoiceRowProps = {
  row: RowProps;
};

function AppAreaLocation({ row }: AppNewInvoiceRowProps) {
  const popover = usePopover();


  const [open, setOpen] = useState(false);
  const [mapData, setMapData] = useState([]);

  const[center, setCenter] = useState({
    lat: 10.6218, // Latitude for Negros Occidental
    lng: 122.9540 // Longitude for Negros Occidental
  });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAYrYkXmvCrViFpOR2xF2FDt2aFXmPfie4"
  })

  // const [center, setCenter] = useState({ lat: 0, lng: 0 });


  // useEffect(()=>{
  //   console.log("CENTER MAP");
  //   console.log(center);
  // }, [center])


  const handleViewMap = () => {
    const geoJsonData = localStorage.getItem('uploadedData');
    if (geoJsonData) {
      const parsedData = JSON.parse(geoJsonData);
      const matchedFeature = parsedData.features.find(
        (feature: { properties: { Project_No: any; }; }) => feature.properties.Project_No === row.Project_No
      );
      const coordinates = matchedFeature.geometry.coordinates;
      const convertCoordinate = convertCoordinates(coordinates);
      // const calculatedCenter = convertCoordinates(coordinates);
      if (matchedFeature) {
        setMapData(convertCoordinate);
        setOpen(true);
        calculateCenter(convertCoordinate);
        // setCenter({lat : 0, long: 0});
      }
    }
    popover.onClose();
  };

  const handleClose = () => {
    setOpen(false);
    setMapData([]);
  };

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const renderGeometry = () => {
    if (mapData.length <= 0) return null;
    return mapData.map((polygonCoords: [any, any][][], index: React.Key | null | undefined) => {
      return   (<Polygon
        key={index}
        paths={polygonCoords[0].map(([lng, lat]) => {
          const coordinate = { lng, lat }
          console.log("longtitude", coordinate.lng)
          console.log("latitude", coordinate.lat)
          return coordinate
        })}
        options={{
          fillColor: '#00FF00',
          fillOpacity: 0.4,
          strokeColor: '#00FF00',
          strokeOpacity: 1,
          strokeWeight: 2,
        }}
      />)
    });
  };

  const calculateCenter = (coordinates: any[]) => {
    let flatCoordinates = [];
    flatCoordinates = coordinates.flat(2);
    const lngSum = flatCoordinates.reduce((acc, coord) => acc + coord[0], 0);
    const latSum = flatCoordinates.reduce((acc, coord) => acc + coord[1], 0);
    const lngCenter = lngSum / flatCoordinates.length;
    const latCenter = latSum / flatCoordinates.length;
    return setCenter({ lat: latCenter, lng: lngCenter });
  };

  const convertCoordinates = (coordinates: any[]) => {
    return coordinates.map((polygon: any[]) => (
      polygon.map((ring: any[]) => (
        ring.map((point: any) => proj4(source, target, point))
      ))
    ));
  };


  const handleDownload = () => {
    popover.onClose();
    console.info('DOWNLOAD', row.Project_No);
  };

  const handlePrint = () => {
    popover.onClose();
    console.info('PRINT', row.Project_No);
  };

  const handleShare = () => {
    popover.onClose();
    console.info('SHARE', row.Project_No);
  };

  const handleDelete = () => {
    popover.onClose();
    console.info('DELETE', row.Project_No);
  };

  return (
    <>
      <TableRow>
          <TableCell>{row.Project_No}</TableCell>
          <TableCell>{row.Proj_Name}</TableCell>
          <TableCell>{row.Tenure_Nam}</TableCell>
          <TableCell>{row.Land_type}</TableCell>
          <TableCell >{row.Original_N}</TableCell>
          <TableCell>{row.Province}</TableCell>
          <TableCell>{row.Municipali}</TableCell>
          <TableCell>{row.Barangays}</TableCell>
          <TableCell>{row.PO_Chairma}</TableCell>
          <TableCell>{row.Contact_Nu}</TableCell>
          <TableCell>{row.CBFMA_No_}</TableCell>
          <TableCell>{row.Date_Issue}</TableCell>
          <TableCell>{row.Expiry_Dat}</TableCell>
          <TableCell>{row.Area_ha}</TableCell>
          <TableCell>
            <Label
              variant="soft"
              color={
                (row.Status === 'Not yet Started' && 'warning') ||
                (row.Status === 'Unidentified Area' && 'error') ||
                'success'
              }
            >
              {row.Status}
            </Label>
          </TableCell>
          <TableCell align="right" sx={{ pr: 1 }}>
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem onClick={handleViewMap}>
          <Iconify icon="material-symbols:map" />
          View Map
        </MenuItem>
        <MenuItem onClick={handleDownload}>
          <Iconify icon="eva:cloud-download-fill" />
          Download
        </MenuItem>
        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Project Map</DialogTitle>
        <DialogContent>
          {mapData &&  (
            <>
            {isLoaded && (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={14}
                center={center}
              >
                {renderGeometry()}
              </GoogleMap>
            )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
