import React, { useState, useEffect } from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { GoogleMap, LoadScript, Polygon, Polyline, Marker, useJsApiLoader } from '@react-google-maps/api';
import proj4 from 'proj4';

import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IInvoice } from 'src/types/invoice';

// ----------------------------------------------------------------------

type Props = {
  row: IInvoice;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function InvoiceTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}: Props) {
  // const { sent, invoiceNumber, createDate, dueDate, status, invoiceTo, totalAmount } = row;
  const { Project_No, Proj_Name, Tenure_Nam, Land_type, Original_N, Province, Municipali, Barangays, PO_Chairma, Contact_Nu, CBFMA_No_, Date_Issue, Expiry_Dat, Area_ha, status } = row;
  // Project_No: properties.Project_No || "-",
  // Proj_Name: properties.Proj_Name || "-",
  // Tenure_Nam: properties.Tenure_Nam || "-",
  // Land_type: properties.Land_type || "-",
  // Original_N: properties.Original_N || "-",
  // Province: properties.Province || "-",
  // Municipali: properties.Municipali || "-",
  // Barangays: properties.Barangays || "-",
  // PO_Chairma: properties.PO_Chairma || "-",
  // Contact_Nu: properties.Contact_Nu || "-",
  // CBFMA_No_: properties.CBFMA_No_ || "-",
  // Date_Issue: properties.Date_Issue || "-",
  // Expiry_Dat: properties.Expiry_Dat || "-",
  // Area_ha: properties.Area_ha !== undefined ? properties.Area_ha : "-",
  // Status: properties.Status || "-",

  const confirm = useBoolean();

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

  // Define your projection source and target
  const source = '+proj=utm +zone=51 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'; // EPSG:32651
  const target = '+proj=longlat +datum=WGS84 +no_defs'; // WGS84 geographic coordinates

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

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={Proj_Name} sx={{ mr: 2 }}>
            {Proj_Name.charAt(0).toUpperCase()}
          </Avatar>

          <ListItemText
            disableTypography
            primary={
              <Typography variant="body2" noWrap>
                {Proj_Name}
              </Typography>
            }
            secondary={
              <Link
                noWrap
                variant="body2"
                onClick={handleViewMap}
                sx={{ color: 'text.disabled', cursor: 'pointer' }}
              >
                {Project_No}
              </Link>
            }
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={Date_Issue}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={Expiry_Dat}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>{PO_Chairma}</TableCell>

        <TableCell align="center">{CBFMA_No_}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'Started' && 'success') ||
              (status === 'Not yet Started' && 'warning') ||
              (status === 'Unidentified Area' && 'error') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
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

        <MenuItem
          onClick={handleViewMap}
        >
          <Iconify icon="material-symbols:map" />
          View Map
        </MenuItem>
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
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

      

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
