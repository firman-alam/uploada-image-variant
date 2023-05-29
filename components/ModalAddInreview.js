'use client';

import dynamic from 'next/dynamic';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import { useEffect, useState, memo, useRef } from 'react';
import { NumericFormat } from 'react-number-format';
import {
  CheckboxWrapper,
  ColumnWrapper,
  HeaderSpaceWrapper,
  OmniField,
  OmniLabel,
  RowWrapper,
  SectionColumnWrapper,
  SectionWrapper,
} from './Form';
import Accordion from './Accordion';
import AccordionSummary from './AccordionSummary';
import AccordionDetails from './AccordionDetails';
import Dropzone from './Dropzone';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Header from './Header';
import ModalVariantImage from './ModalVariantImage';
import { Camera } from 'mdi-material-ui';

const QuillNoSSRWrapper = memo(
  dynamic(
    async () => {
      const { default: RQ } = await import('react-quill');

      return ({ forwardedRef, onKeyPress, onKeyUp, onKeyDown, ...props }) => (
        <RQ
          ref={forwardedRef}
          onKeyPress={onKeyPress}
          onKeyUp={onKeyUp}
          onKeyDown={onKeyDown}
          {...props}
        />
      );
    },
    {
      ssr: false,
      loading: () => <p>Loading ...</p>,
    }
  )
);

const validationSchema = Yup.object().shape({
  nama_barang: Yup.string().required('Nama harus diisi'),
  // sku: Yup.string().required('SKU harus diisi'),
  deskripsi: Yup.string()
    .min(30, 'Deskripsi harus di antara 30 dan 3000.')
    .max(3000, 'Deskripsi harus di antara 30 dan 3000.')
    .required('Deskripsi harus diisi'),
  berat_paket: Yup.number().required('Berat paket (Gram) harus diisi'),
  harga_default: Yup.number()
    .required('Harga default harus diiisi')
    .test(
      'minimum',
      'Harga Default harus lebih besar atau sama dengan 100.',
      (value) => value >= 100
    ),
});

const ModalAddInreview = ({ handleForm }) => {
  const [sameVariaton, setSameVariaton] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState([]);

  // rtk query

  // modal variasi images
  const [openModal, setOpenModal] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  // Function to handle opening the dialog and setting the selected row index
  const handleOpenModal = (index) => {
    setSelectedRowIndex(index);
    setOpenModal(true);
  };

  // variasi barang
  const [dataVariant, setDataVariant] = useState({});
  const value = Object.values(dataVariant);
  const generateTableRows = (data, currentIndex, currentRow) => {
    if (currentIndex === data.length) {
      return [currentRow];
    }

    const currentArray = data[currentIndex];
    const rows = currentArray.map((value) =>
      generateTableRows(data, currentIndex + 1, [...currentRow, value])
    );

    return rows.flat();
  };
  const tableRows = generateTableRows(value, 0, []);
  const setInitialValues = () => {
    tableRows.forEach((row, index) => {
      setFieldValue(
        `variasi_barang_detail[${index}].sku`,
        `ITM-${row.join('-')}`
      );
      setFieldValue(
        `variasi_barang_detail[${index}].nama_variasi`,
        row.join('-')
      );
    });
  };
  useEffect(() => {
    setInitialValues();
  }, [dataVariant]);

  // accordion
  const [accordionState, setAccordionState] = useState({
    first: true,
    second: true,
    third: true,
    fourth: true,
    fifth: true,
    sixth: true,
  });
  const toggleAccordion = (accordionKey) => {
    setAccordionState((prevState) => ({
      ...prevState,
      [accordionKey]: !prevState[accordionKey],
    }));
  };
  // dropzone
  const [uploadFile, setUploadFile] = useState([]);
  const acceptedFileType = {
    'mime/type': ['.jpg', '.jpeg', '.png', '.gif', '.tiff'],
  };

  // category
  const handleCategory = (e) => {
    setFieldValue('parent_category_barang', e.target.value);
  };

  const handleSubCategory = (e) => {
    setFieldValue('child_category_barang', e.target.value);
  };

  const handleSubSubCategory = (e) => {
    setFieldValue('sub_category_barang', e.target.value);
  };

  // dropzone function
  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = (error) =>
        console.warn(`Reading of file ${file.name} was aborted.`);
      reader.onerror = (error) =>
        console.error(`Reading of file ${file.name} has failed.`);
      reader.onloadend = (e) => {
        setUploadFile((prevState) => [
          ...prevState,
          {
            FileName: file.name,
            FileData: e.target.result,
            id: idImage,
            FkModuleId: 100001,
            FkContentId: 1,
          },
        ]);

        setIdImage(idImage++);
        setFieldValue('photos', [
          ...values.photos,
          {
            FileName: file.name,
            FileData: e.target.result,
            id: values.photos.length,
            FkModuleId: 100001,
            FkContentId: 1,
          },
        ]);
      };

      reader.readAsDataURL(file);
    });
  };
  const removeImage = (value) => {
    setUploadFile((current) => {
      return current.filter((item) => item.id != value);
    });
    setFieldValue(
      'photos',
      uploadFile.filter((item) => item.id !== value)
    );
  };

  // produk konsinyasi
  const handleKonsinyasi = () => {
    const updatedValue = !values.produk_konsinyasi;
    setFieldValue('produk_konsinyasi', !values.produk_konsinyasi);
    setFieldValue('akun_penjualan', updatedValue ? 2 : 4);
  };

  // Formik
  const {
    values,
    getFieldProps,
    setFieldValue,
    handleSubmit,
    handleChange,
    touched,
    errors,
  } = useFormik({
    initialValues: {
      nama_barang: '',
      parent_category_barang: '',
      child_category_barang: '',
      sub_category_barang: '',
      brand_id: null,
      brand_name: '',
      sku: '',
      deskripsi: '',
      photos: [],
      variasi_barang: [
        {
          tipe_variasi: [],
          nama_variasi: '',
          variasi_value: [],
        },
      ],
      variasi_barang_detail: [
        {
          sku: '',
          nama_variasi: '',
          barcode: '',
          harga_jual: null,
          harga_beli: null,
          variant_images: [],
        },
      ],
      berat_paket: null,
      dijual: true,
      dibeli: true,
      disimpan: true,
      produk_konsinyasi: false,
      harga_default: null,
      akun_penjualan: null,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      addInreview(values);
      handleForm();
    },
  });

  // console.log(values.variasi_barang_detail);
  // console.log(selectedRowIndex);

  return (
    <Box
      component={Paper}
      sx={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}
    >
      {/* Title */}
      <Header title='Tambah Barang' handleForm={handleForm} />

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Detail Barang */}
          <Box>
            <Accordion
              expanded={accordionState.first}
              onChange={() => toggleAccordion('first')}
            >
              <AccordionSummary>
                <Typography>Detail Barang</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <SectionWrapper>
                  <RowWrapper>
                    <OmniLabel>
                      <Typography>Judul Iklan</Typography>
                    </OmniLabel>
                    <OmniField>
                      <TextField
                        name='judul_iklan'
                        onChange={handleChange}
                        error={
                          touched.judul_iklan && Boolean(errors.judul_iklan)
                        }
                        helperText={touched.judul_iklan && errors.judul_iklan}
                        fullWidth
                      />
                    </OmniField>
                  </RowWrapper>
                  <RowWrapper>
                    <OmniLabel>
                      <Typography fontWeight='bold'>Nama</Typography>
                    </OmniLabel>
                    <OmniField>
                      <TextField
                        name='nama_barang'
                        onChange={handleChange}
                        error={
                          touched.nama_barang && Boolean(errors.nama_barang)
                        }
                        helperText={touched.nama_barang && errors.nama_barang}
                        fullWidth
                      />
                    </OmniField>
                  </RowWrapper>
                  <RowWrapper>
                    <OmniLabel>
                      <Typography fontWeight='bold'>Kategori Barang</Typography>
                    </OmniLabel>
                    <OmniField display={'flex'}>
                      <Select
                        name='parent_category_barang'
                        value={values.parent_category_barang}
                        onChange={(e) => handleCategory(e)}
                      >
                        {categories?.map((c) => (
                          <MenuItem key={c.category_id} value={c.category_id}>
                            {c.nama_kategori}
                          </MenuItem>
                        ))}
                      </Select>
                      {/* Child */}
                      {sub_cat?.total !== 0 && sub_cat !== undefined && (
                        <Select
                          name='child_category_barang'
                          value={values.child_category_barang}
                          onChange={(e) => handleSubCategory(e)}
                        >
                          <MenuItem value=''>None</MenuItem>
                          {sub_cat?.data?.map((s) => (
                            <MenuItem key={s.category_id} value={s.category_id}>
                              {s.nama_kategori}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                      {/* Child */}
                      {sub_sub_cat !== undefined &&
                        sub_sub_cat?.total !== 0 && (
                          <Select
                            name='sub_category_barang'
                            value={values.sub_category_barang}
                            onChange={(e) => handleSubSubCategory(e)}
                          >
                            <MenuItem value=''>None</MenuItem>
                            {sub_sub_cat?.data?.map((s) => (
                              <MenuItem
                                key={s.category_id}
                                value={s.category_id}
                              >
                                {s.nama_kategori}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                    </OmniField>
                  </RowWrapper>
                  <RowWrapper>
                    <OmniLabel />
                    <OmniField display={'flex'}>
                      <Switch
                        onChange={() => setSameVariaton((prev) => !prev)}
                      />
                      <Typography>
                        Barang ini memiliki beberapa variasi seperti ukuran dan
                        warna
                      </Typography>
                    </OmniField>
                  </RowWrapper>
                  <RowWrapper>
                    <OmniLabel>
                      <Typography>Merk</Typography>
                    </OmniLabel>
                    <OmniField>
                      <Autocomplete
                        options={brands}
                        getOptionLabel={(data) => data?.nama_brand}
                        onChange={(event, value) => {
                          setFieldValue('brand_id', value?.kode_brand);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name='brand_id'
                            placeholder='Harap pilih'
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                height: 35,
                                paddingTop: 0.1,
                                paddingBottom: '4px',
                              },
                            }}
                          />
                        )}
                      />
                    </OmniField>
                  </RowWrapper>
                  <RowWrapper>
                    <OmniLabel>
                      <Typography>Merk Lainnya</Typography>
                    </OmniLabel>
                    <OmniField>
                      <TextField
                        id='merk_lainnya'
                        name='merk_lainnya'
                        onChange={handleChange}
                        fullWidth
                      />
                    </OmniField>
                  </RowWrapper>
                  {!sameVariaton && (
                    <>
                      <RowWrapper>
                        <OmniLabel>
                          <Typography fontWeight='bold'>SKU</Typography>
                        </OmniLabel>
                        <OmniField>
                          <TextField
                            name='sku'
                            onChange={handleChange}
                            error={touched.sku && Boolean(errors.sku)}
                            helperText={touched.sku && errors.sku}
                            fullWidth
                          />
                        </OmniField>
                      </RowWrapper>
                      <RowWrapper>
                        <OmniLabel>
                          <Typography>Barcode</Typography>
                        </OmniLabel>
                        <OmniField>
                          <TextField
                            name='barcode'
                            fullWidth
                            onChange={handleChange}
                          />
                        </OmniField>
                      </RowWrapper>
                    </>
                  )}
                  <RowWrapper>
                    <OmniLabel>
                      <Typography fontWeight='bold'>Deskripsi</Typography>
                    </OmniLabel>
                    <OmniField>
                      <QuillNoSSRWrapper
                        name='deskripsi'
                        error={touched.deskripsi && Boolean(errors.deskripsi)}
                        onChange={(value) => setFieldValue('deskripsi', value)}
                      />
                      {touched.deskripsi && errors.deskripsi && (
                        <Box color='error.main' mt={1} fontSize={12} pl={3}>
                          {errors.deskripsi}
                        </Box>
                      )}
                    </OmniField>
                  </RowWrapper>
                </SectionWrapper>
              </AccordionDetails>
            </Accordion>
          </Box>
          {/* Atribute Barang */}
          {/* {sub_cat?.total > 0 && (
            <Box>
              <Accordion
                expanded={accordionState.second}
                onChange={() => toggleAccordion('second')}
              >
                <AccordionSummary>
                  <Typography>Atribut</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <SectionWrapper>
                    {attr?.map((a) => (
                      <RowWrapper key={a.AttributeId}>
                        <OmniLabel>
                          <Typography>{a.AttributeName}</Typography>
                        </OmniLabel>
                        <OmniField>
                          {a?.AttributeValue.length == 0 ? (
                            <Autocomplete
                              id={a.AttributeName.toLowerCase().replace(
                                /\s+/g,
                                '_'
                              )}
                              name={a.AttributeName.toLowerCase().replace(
                                /\s+/g,
                                '_'
                              )}
                              options={[]}
                              freeSolo
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      height: 35,
                                      paddingTop: 0.1,
                                      paddingBottom: '4px',
                                    },
                                  }}
                                  fullWidth
                                />
                              )}
                              onChange={(event, values) => {
                                setFieldValue(
                                  `atribut_barang.${index}.attribute_id`,
                                  values?.AttributeId || ''
                                );
                                setFieldValue(
                                  `atribut_barang.${index}.value_text`,
                                  values
                                );
                              }}
                            />
                          ) : (
                            <Autocomplete
                              id={a.AttributeName.toLowerCase().replace(
                                /\s+/g,
                                '_'
                              )}
                              name={a.AttributeName.toLowerCase().replace(
                                /\s+/g,
                                '_'
                              )}
                              options={a.AttributeValue}
                              getOptionLabel={(data) => data.ValueName}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      height: 35,
                                      paddingTop: 0.1,
                                      paddingBottom: '4px',
                                    },
                                  }}
                                  fullWidth
                                />
                              )}
                              onChange={(event, values) => {
                                setFieldValue(
                                  `atribut_barang.${index}.attribute_id`,
                                  values?.AttributeId || ''
                                );
                                setFieldValue(
                                  `atribut_barang.${index}.value_id`,
                                  values?.ValueId || ''
                                );
                              }}
                            />
                          )}
                        </OmniField>
                      </RowWrapper>
                    ))}
                  </SectionWrapper>
                </AccordionDetails>
              </Accordion>
            </Box>
          )} */}
          {/* Foto */}
          <Box>
            <Accordion
              expanded={accordionState.third}
              onChange={() => toggleAccordion('third')}
            >
              <AccordionSummary>
                <Typography>Foto Produk</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  sx={{
                    padding: '1rem',
                    display: 'flex',
                    alignContent: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Dropzone
                    onDrop={onDrop}
                    accept={acceptedFileType}
                    uploadFile={uploadFile}
                    removeImage={removeImage}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
          {/* Variasi Barang */}
          <Box>
            <Accordion
              expanded={accordionState.fourth}
              onChange={() => toggleAccordion('fourth')}
            >
              <AccordionSummary>
                <Typography>Variasi</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <SectionWrapper>
                  {/* Type Variant */}

                  <RowWrapper>
                    <OmniLabel>
                      <Typography>Tipe Variasi</Typography>
                    </OmniLabel>
                    <OmniField>
                      <Autocomplete
                        multiple
                        options={variants || []}
                        getOptionLabel={(data) => data?.nama_variant}
                        onChange={(e, v) => {
                          setSelectedVariants(v);
                          setFieldValue('tipe_variasi', selectedVariants);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                height: 35,
                                paddingTop: 0.1,
                                paddingBottom: '4px',
                              },
                            }}
                            placeholder='Harap pilih'
                          />
                        )}
                      />
                    </OmniField>
                  </RowWrapper>

                  {/* Variant Form */}
                  {selectedVariants?.map((variant, index) => (
                    <RowWrapper key={variant.nama_variant}>
                      <OmniLabel>
                        <Typography>{variant.nama_variant}</Typography>
                      </OmniLabel>
                      <OmniField>
                        {variant.variant_values === null ? (
                          <Autocomplete
                            name={variant.nama_variant
                              .toLowerCase()
                              .replace(/\s+/g, '_')}
                            options={[]}
                            multiple
                            freeSolo
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    height: 35,
                                    paddingTop: 0.1,
                                    paddingBottom: '4px',
                                  },
                                }}
                                fullWidth
                              />
                            )}
                            onChange={(event, values) => {
                              setDataVariant((prevDataVariant) => ({
                                ...prevDataVariant,
                                [variant.nama_variant]: values,
                              }));
                              setFieldValue(
                                `variasi_barang.${index}.nama_variasi`,
                                variant.nama_variant || ''
                              );
                              setFieldValue(
                                `variasi_barang.${index}.variasi_values`,
                                values || ''
                              );
                            }}
                          />
                        ) : (
                          <Autocomplete
                            multiple
                            name={variant?.nama_variant
                              .toLowerCase()
                              .replace(/\s+/g, '_')}
                            options={variant.variant_values}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    height: 35,
                                    paddingTop: 0.1,
                                    paddingBottom: '4px',
                                  },
                                }}
                                fullWidth
                              />
                            )}
                            onChange={(event, values) => {
                              setDataVariant((prevDataVariant) => ({
                                ...prevDataVariant,
                                [variant.nama_variant]: values,
                              }));
                              setFieldValue(
                                `variasi_barang.${index}.nama_variasi`,
                                variant.nama_variant || ''
                              );
                              setFieldValue(
                                `variasi_barang.${index}.variasi_values`,
                                values || ''
                              );
                            }}
                          />
                        )}
                      </OmniField>
                    </RowWrapper>
                  ))}
                </SectionWrapper>
                {/* Table */}
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {selectedVariants.length == 0 && (
                          <>
                            <TableCell>Kode SKU</TableCell>
                            <TableCell>Harga Beli</TableCell>
                          </>
                        )}
                        {selectedVariants.length > 0 && (
                          <>
                            <TableCell>Kode SKU</TableCell>
                            <TableCell>Nama Variasi</TableCell>
                            <TableCell>Barcode</TableCell>
                            <TableCell>Harga Jual</TableCell>
                            <TableCell>Harga Beli</TableCell>
                          </>
                        )}
                        <TableCell sx={{ width: 100 }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedVariants.length == 0 && (
                        <TableRow>
                          <TableCell>
                            <TextField
                              name={`variasi_barang_detail[0].sku`}
                              onChange={handleChange}
                            />
                          </TableCell>
                          <TableCell>
                            <NumericFormat
                              name={`variasi_barang_detail[0].harga_beli`}
                              thousandSeparator={true}
                              customInput={TextField}
                              inputProps={{ maxLength: 15 }}
                              allowNegative={false}
                              onValueChange={(value) =>
                                setFieldValue(
                                  `variasi_barang_detail[0].harga_beli`,
                                  parseInt(value.value)
                                )
                              }
                              fullWidth
                            />
                          </TableCell>
                        </TableRow>
                      )}
                      {selectedVariants.length > 0 &&
                        tableRows.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <TextField
                                name={`variasi_barang_detail[${index}].sku`}
                                value={
                                  values?.variasi_barang_detail[index]?.sku ||
                                  null
                                }
                                onChange={handleChange}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                name={`variasi_barang_detail[${index}].nama_variasi`}
                                value={
                                  values?.variasi_barang_detail[index]
                                    ?.nama_variasi || null
                                }
                                onChange={handleChange}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                name={`variasi_barang_detail[${index}].barcode`}
                                onChange={handleChange}
                              />
                            </TableCell>
                            <TableCell>
                              <NumericFormat
                                name={`variasi_barang_detail[${index}].harga_jual`}
                                thousandSeparator={true}
                                customInput={TextField}
                                inputProps={{ maxLength: 15 }}
                                allowNegative={false}
                                onValueChange={(value) =>
                                  setFieldValue(
                                    `variasi_barang_detail[${index}].harga_jual`,
                                    parseInt(value.value)
                                  )
                                }
                                fullWidth
                              />
                            </TableCell>
                            <TableCell>
                              <NumericFormat
                                name={`variasi_barang_detail[${index}].harga_beli`}
                                thousandSeparator={true}
                                customInput={TextField}
                                inputProps={{ maxLength: 15 }}
                                allowNegative={false}
                                onValueChange={(value) =>
                                  setFieldValue(
                                    `variasi_barang_detail[${index}].harga_beli`,
                                    parseInt(value.value)
                                  )
                                }
                                fullWidth
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant='outlined'
                                sx={{ height: 35 }}
                                onClick={() => handleOpenModal(index)}
                              >
                                <Camera />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>

                  <ModalVariantImage
                    id={
                      selectedRowIndex !== null
                        ? values?.variasi_barang_detail[selectedRowIndex]
                            ?.sku || null
                        : ''
                    }
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    handleImage={(images) => {
                      setFieldValue(
                        `variasi_barang_detail[${selectedRowIndex}].variant_images`,
                        images
                      );
                    }}
                    uploadFile={
                      values?.variasi_barang_detail[selectedRowIndex]
                        ?.variant_images || []
                    }
                  />
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Box>
          {/* Info Pengiriman */}
          <Box>
            <Accordion
              expanded={accordionState.fifth}
              onChange={() => toggleAccordion('fifth')}
            >
              <AccordionSummary>
                <Typography>Info Pengiriman</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <SectionColumnWrapper>
                  <ColumnWrapper>
                    <RowWrapper>
                      <OmniLabel>
                        <Typography fontWeight='bold'>
                          Berat Paket (Gram)
                        </Typography>
                      </OmniLabel>
                      <OmniField>
                        <NumericFormat
                          name='berat_paket'
                          thousandSeparator={true}
                          customInput={TextField}
                          inputProps={{ maxLength: 15 }}
                          allowNegative={false}
                          onValueChange={(value) =>
                            setFieldValue('berat_paket', parseInt(value.value))
                          }
                          error={
                            touched.berat_paket && Boolean(errors.berat_paket)
                          }
                          helperText={touched.berat_paket && errors.berat_paket}
                          fullWidth
                        />
                      </OmniField>
                    </RowWrapper>
                    <RowWrapper>
                      <OmniLabel>
                        <Typography>Panjang Paket (cm)</Typography>
                      </OmniLabel>
                      <OmniField>
                        <NumericFormat
                          name='panjang_paket'
                          thousandSeparator={true}
                          customInput={TextField}
                          inputProps={{ maxLength: 15 }}
                          allowNegative={false}
                          onValueChange={(value) =>
                            setFieldValue(
                              'panjang_paket',
                              parseInt(value.value)
                            )
                          }
                          fullWidth
                        />
                      </OmniField>
                    </RowWrapper>
                    <RowWrapper>
                      <OmniLabel>
                        <Typography>Tinggi Paket (cm)</Typography>
                      </OmniLabel>
                      <OmniField>
                        <NumericFormat
                          name='tinggi_paket'
                          thousandSeparator={true}
                          customInput={TextField}
                          inputProps={{ maxLength: 15 }}
                          allowNegative={false}
                          onValueChange={(value) =>
                            setFieldValue('tinggi_paket', parseInt(value.value))
                          }
                          fullWidth
                        />
                      </OmniField>
                    </RowWrapper>
                    <RowWrapper>
                      <OmniLabel>
                        <Typography>Lebar Paket (cm)</Typography>
                      </OmniLabel>
                      <OmniField>
                        <NumericFormat
                          name='lebar_paket'
                          thousandSeparator={true}
                          customInput={TextField}
                          inputProps={{ maxLength: 15 }}
                          allowNegative={false}
                          onValueChange={(value) =>
                            setFieldValue('lebar_paket', parseInt(value.value))
                          }
                          fullWidth
                        />
                      </OmniField>
                    </RowWrapper>
                  </ColumnWrapper>
                  <ColumnWrapper>
                    <RowWrapper>
                      <OmniLabel>
                        <Typography>Isi Paket</Typography>
                      </OmniLabel>
                      <OmniField>
                        <TextareaAutosize
                          name='isi_paket'
                          onChange={handleChange}
                          minRows={5}
                          style={{
                            minWidth: 220,
                            maxWidth: 500,
                            width: '100%',
                          }}
                        />
                      </OmniField>
                    </RowWrapper>
                  </ColumnWrapper>
                </SectionColumnWrapper>
              </AccordionDetails>
            </Accordion>
          </Box>
          {/* Info Penjualan & Pembelian*/}
          <Box>
            <Accordion
              expanded={accordionState.sixth}
              onChange={() => toggleAccordion('sixth')}
            >
              <AccordionSummary>Info Penjualan & Pembelian</AccordionSummary>
              <AccordionDetails>
                <Box
                  sx={{
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  {/* Header */}
                  <HeaderSpaceWrapper>
                    {/* Checkbox */}
                    <CheckboxWrapper>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.dijual}
                            onChange={handleChange}
                          />
                        }
                        label='Di Jual'
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.dibeli}
                            onChange={handleChange}
                          />
                        }
                        label='Di Beli'
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.disimpan}
                            onChange={handleChange}
                          />
                        }
                        label='Di Simpan'
                      />
                    </CheckboxWrapper>
                    {/* Switch */}
                    <FormControlLabel
                      sx={{ display: 'flex', gap: '1rem' }}
                      name='produk_konsinyasi'
                      control={
                        <Switch
                          checked={values.produk_konsinyasi}
                          onChange={handleKonsinyasi}
                        />
                      }
                      label='Produk Konsinyasi'
                    />
                  </HeaderSpaceWrapper>

                  {/* Form */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    <Box sx={{ flex: 6 }}>
                      {values.dijual && (
                        <Box>
                          {/* Title */}
                          <Typography>Penjualan</Typography>
                          <Divider />
                          {/* Form */}
                          <SectionWrapper>
                            <RowWrapper>
                              <OmniLabel>
                                <Typography fontWeight='bold'>
                                  Harga Default
                                </Typography>
                              </OmniLabel>
                              <OmniField>
                                <NumericFormat
                                  name='harga_default'
                                  thousandSeparator={true}
                                  customInput={TextField}
                                  inputProps={{ maxLength: 15 }}
                                  allowNegative={false}
                                  onValueChange={(value) =>
                                    setFieldValue(
                                      'harga_default',
                                      parseInt(value.value)
                                    )
                                  }
                                  error={
                                    touched.harga_default &&
                                    Boolean(errors.harga_default)
                                  }
                                  helperText={
                                    touched.harga_default &&
                                    errors.harga_default
                                  }
                                  fullWidth
                                />
                              </OmniField>
                            </RowWrapper>
                            <RowWrapper>
                              <OmniLabel>
                                <Typography>Pajak Penjualan</Typography>
                              </OmniLabel>
                              <OmniField>
                                <Autocomplete
                                  options={pajak_penjualan}
                                  getOptionLabel={(data) =>
                                    data?.NamaSellingTax
                                  }
                                  onChange={(event, value) => {
                                    setFieldValue(
                                      'pajak_penjualan',
                                      value?.KodeSellingTax
                                    );
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      name='pajak_penjualan'
                                      placeholder='Harap pilih'
                                      sx={{
                                        '& .MuiOutlinedInput-root': {
                                          height: 35,
                                          paddingTop: 0.1,
                                          paddingBottom: '4px',
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </OmniField>
                            </RowWrapper>
                            <RowWrapper>
                              <OmniLabel>
                                <Typography>Akun Penjualan</Typography>
                              </OmniLabel>
                              <OmniField>
                                <Autocomplete
                                  {...getFieldProps('akun_penjualan')}
                                  options={akun_penjualan}
                                  getOptionLabel={(data) =>
                                    data?.NamaSellingAccount
                                  }
                                  onChange={(event, value) => {
                                    setFieldValue(
                                      'akun_penjualan',
                                      value?.KodeSellingAccount
                                    );
                                  }}
                                  value={
                                    akun_penjualan.find(
                                      (v) =>
                                        v.KodeSellingAccount ===
                                        values.akun_penjualan
                                    ) || null
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      name='akun_penjualan'
                                      placeholder='Harap pilih'
                                      sx={{
                                        '& .MuiOutlinedInput-root': {
                                          height: 35,
                                          paddingTop: 0.1,
                                          paddingBottom: '4px',
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </OmniField>
                            </RowWrapper>
                            <RowWrapper>
                              <OmniLabel>
                                <Typography>Retur Penjualan</Typography>
                              </OmniLabel>
                              <OmniField>
                                <Autocomplete
                                  options={retur_penjualan}
                                  getOptionLabel={(data) =>
                                    data?.NamaSellingReturn
                                  }
                                  onChange={(event, value) => {
                                    setFieldValue(
                                      'retur_penjualan',
                                      value?.KodeSellingReturn
                                    );
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      name='retur_penjualan'
                                      placeholder='Harap pilih'
                                      sx={{
                                        '& .MuiOutlinedInput-root': {
                                          height: 35,
                                          paddingTop: 0.1,
                                          paddingBottom: '4px',
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </OmniField>
                            </RowWrapper>
                          </SectionWrapper>
                        </Box>
                      )}
                      {values.disimpan && (
                        <Box>
                          {/* Title */}
                          <Typography>Persediaan</Typography>
                          <Divider />
                          {/* Form */}
                          <SectionWrapper>
                            <RowWrapper>
                              <OmniLabel>
                                <Typography>Batas Stok Menipis</Typography>
                              </OmniLabel>
                              <OmniField>
                                <NumericFormat
                                  name='stok_menipis'
                                  thousandSeparator={true}
                                  customInput={TextField}
                                  inputProps={{ maxLength: 15 }}
                                  allowNegative={false}
                                  onValueChange={(value) =>
                                    setFieldValue(
                                      'stok_menipis',
                                      parseInt(value.value)
                                    )
                                  }
                                  fullWidth
                                />
                              </OmniField>
                            </RowWrapper>
                            <RowWrapper>
                              <OmniLabel>
                                <Typography>
                                  Stok Tidak Terbatas di Toko
                                </Typography>
                              </OmniLabel>
                              <OmniField>
                                <Autocomplete
                                  multiple
                                  options={shop_list?.data}
                                  getOptionLabel={(data) => data.shop_name}
                                  onChange={(event, newValue) => {
                                    const selectedShopIds = newValue.map(
                                      (item) => item.shop_id
                                    );
                                    setFieldValue(
                                      'stok_tidak_terbatas',
                                      selectedShopIds
                                    );
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      name='stok_tidak_terbatas'
                                      sx={{
                                        '& .MuiOutlinedInput-root': {
                                          paddingTop: 0.1,
                                          paddingBottom: '4px',
                                        },
                                      }}
                                      placeholder='Harap pilih'
                                    />
                                  )}
                                />
                              </OmniField>
                            </RowWrapper>
                            <RowWrapper>
                              <OmniLabel>
                                <Typography>Batas Stok Aman</Typography>
                              </OmniLabel>
                              <OmniField>
                                <NumericFormat
                                  name='stok_aman'
                                  thousandSeparator={true}
                                  customInput={TextField}
                                  inputProps={{ maxLength: 15 }}
                                  allowNegative={false}
                                  onValueChange={(value) =>
                                    setFieldValue(
                                      'stok_aman',
                                      parseInt(value.value)
                                    )
                                  }
                                  fullWidth
                                />
                              </OmniField>
                            </RowWrapper>
                          </SectionWrapper>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ flex: 6 }}>
                      {values.dibeli && (
                        <Box>
                          {/* Title */}
                          <Typography>Pembelian</Typography>
                          <Divider />
                          {/* Form */}
                          <SectionWrapper>
                            <RowWrapper>
                              <OmniLabel>
                                <Typography>Harga Beli</Typography>
                              </OmniLabel>
                              <OmniField>
                                <NumericFormat
                                  name='harga_beli'
                                  thousandSeparator={true}
                                  customInput={TextField}
                                  inputProps={{ maxLength: 15 }}
                                  allowNegative={false}
                                  onValueChange={(value) =>
                                    setFieldValue(
                                      'harga_beli',
                                      parseInt(value.value)
                                    )
                                  }
                                  fullWidth
                                />
                              </OmniField>
                            </RowWrapper>
                            <RowWrapper>
                              <OmniLabel>
                                <Typography>Pajak Pembelian</Typography>
                              </OmniLabel>
                              <OmniField>
                                <Autocomplete
                                  options={pajak_pembelian}
                                  getOptionLabel={(data) => data?.NamaBuyingTax}
                                  onChange={(event, value) => {
                                    setFieldValue(
                                      'pajak_pembelian',
                                      value?.KodeBuyingTax
                                    );
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      name='pajak_pembelian'
                                      placeholder='Harap pilih'
                                      sx={{
                                        '& .MuiOutlinedInput-root': {
                                          height: 35,
                                          paddingTop: 0.1,
                                          paddingBottom: '4px',
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </OmniField>
                            </RowWrapper>
                            <RowWrapper>
                              <OmniLabel>
                                <Typography>Akun Persediaan</Typography>
                              </OmniLabel>
                              <OmniField>
                                <Autocomplete
                                  options={akun_persediaan}
                                  getOptionLabel={(data) =>
                                    data?.NamaSupplyAccount
                                  }
                                  onChange={(event, value) => {
                                    setFieldValue(
                                      'akun_persediaan',
                                      value?.KodeSupplyAccount
                                    );
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      name='akun_persediaan'
                                      placeholder='Harap pilih'
                                      sx={{
                                        '& .MuiOutlinedInput-root': {
                                          height: 35,
                                          paddingTop: 0.1,
                                          paddingBottom: '4px',
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </OmniField>
                            </RowWrapper>
                            <RowWrapper>
                              <OmniLabel>
                                <Typography>Akun HPP</Typography>
                              </OmniLabel>
                              <OmniField>
                                <Autocomplete
                                  options={akun_hpp}
                                  getOptionLabel={(data) =>
                                    data?.NamaHppAccount
                                  }
                                  onChange={(event, value) => {
                                    setFieldValue(
                                      'akun_hpp',
                                      value?.KodeHppAccount
                                    );
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      name='akun_hpp'
                                      placeholder='Harap pilih'
                                      sx={{
                                        '& .MuiOutlinedInput-root': {
                                          height: 35,
                                          paddingTop: 0.1,
                                          paddingBottom: '4px',
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </OmniField>
                            </RowWrapper>
                            <RowWrapper>
                              <OmniLabel>
                                <Typography>Lama Pembelian</Typography>
                              </OmniLabel>
                              <OmniField>
                                <NumericFormat
                                  name='lama_pembelian'
                                  thousandSeparator={true}
                                  customInput={TextField}
                                  inputProps={{ maxLength: 15 }}
                                  allowNegative={false}
                                  onValueChange={(value) =>
                                    setFieldValue(
                                      'lama_pembelian',
                                      parseInt(value.value)
                                    )
                                  }
                                  fullWidth
                                />
                              </OmniField>
                            </RowWrapper>
                          </SectionWrapper>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>

        {/* Button */}
        <HeaderSpaceWrapper marginTop={'1rem'}>
          <Button color='success'>Aktifitas</Button>
          <Button type='submit'>Simpan</Button>
        </HeaderSpaceWrapper>
      </form>
    </Box>
  );
};

export default ModalAddInreview;

const categories = [
  {
    nama_kategori: 'Baju',
    category_id: 1,
    parent_category_id: 0,
  },
  {
    nama_kategori: 'Buku',
    category_id: 2,
    parent_category_id: 0,
  },
];

const sub_cat = [
  {
    nama_kategori: 'Atasan',
    category_id: 11,
    parent_category_id: 1,
  },
  {
    nama_kategori: 'Novel',
    category_id: 21,
    parent_category_id: 2,
  },
];

const sub_sub_cat = [
  {
    nama_kategori: 'Kemeja',
    category_id: 101,
    parent_category_id: 11,
  },
  {
    kode_kategori: 2,
    nama_kategori: 'Novel Dewasa',
    category_id: 201,
    parent_category_id: 21,
  },
];

const brands = [{ kode_brand: 1, nama_brand: 'ABC' }];

const variants = [
  { nama_variant: 'Warna', variant_values: ['Merah', 'Biru', 'Kuning'] },
  { nama_variant: 'Ukuran', variant_values: ['XL', 'L', 'M', 'S'] },
];

const pajak_penjualan = [
  { KodeSellingTax: 1, NamaSellingTax: 'No Tax' },
  { KodeSellingTax: 2, NamaSellingTax: 'PPN 10%' },
  { KodeSellingTax: 3, NamaSellingTax: 'PPN 11%' },
];

const pajak_pembelian = [
  { KodeBuyingTax: 1, NamaBuyingTax: 'No Tax' },
  { KodeBuyingTax: 2, NamaBuyingTax: 'PPN 10%' },
  { KodeBuyingTax: 3, NamaBuyingTax: 'PPN 11%' },
];

const akun_penjualan = [
  { KodeSellingAccount: 1, NamaSellingAccount: '1-1000' },
  { KodeSellingAccount: 2, NamaSellingAccount: '2-2000' },
  { KodeSellingAccount: 3, NamaSellingAccount: '3-3000' },
];

const akun_persediaan = [
  { KodeSupplyAccount: 1, NamaSupplyAccount: '1-1000' },
  { KodeSupplyAccount: 2, NamaSupplyAccount: '2-2000' },
  { KodeSupplyAccount: 3, NamaSupplyAccount: '3-3000' },
];

const akun_hpp = [
  { KodeHppAccount: 1, NamaHppAccount: '1-1000' },
  { KodeHppAccount: 2, NamaHppAccount: '2-2000' },
  { KodeHppAccount: 3, NamaHppAccount: '3-3000' },
];

const retur_penjualan = [
  { KodeSellingReturn: 1, NamaSellingReturn: 'Toko' },
  { KodeSellingReturn: 2, NamaSellingReturn: 'Kurir' },
];

const shop_list = {
  data: [
    { shop_id: 1, shop_name: 'Toko 1' },
    { shop_id: 2, shop_name: 'Toko 2' },
    { shop_id: 3, shop_name: 'Toko 3' },
  ],
};
