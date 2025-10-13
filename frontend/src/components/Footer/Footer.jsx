import React from 'react';
import Grid2 from '@mui/material/Grid2';
import { styled } from '@mui/system';
import { Typography, Link, Grid, Box } from '@mui/material';
import {
  Facebook,
  LinkedIn,
  YouTube,
  Instagram,
  Language,
  MusicNote,
} from '@mui/icons-material';
import strings from '../../assets/Strings/FooterStrings';
import styles from '../../assets/css/footer.module.css';

// Mapeo entre el string 'icon' en FooterStrings y el componente MUI Icon
const ICON_MAP = {
  facebook: Facebook,
  linkedin: LinkedIn,
  youtube: YouTube,
  instagram: Instagram,
  tiktok: MusicNote,
  web: Language,
};

// Componente grid personalizado (solo para responsive text-align)
const CustomGrid2 = styled(Grid2)(({ theme }) => ({
  textAlign: 'left',
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
  },
}));

const Footer = () => {
  const {
    labelDirection,
    directionStreet,
    directionCity,
    labelPhone,
    phone,
    labelMail,
    mail,
    labelSocial,
    socialLinks,
    footerText,
    campusName,
    facultad,
    numLab,
  } = strings;

  // Seccion de redes: dividimos en 2 columnas (3 y 3) visualmente
  const firstColumn = socialLinks.slice(0, 3);
  const secondColumn = socialLinks.slice(3, 6);

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        {/* Container principal: ajusta gap en CSS con --footer-col-gap */}
        <CustomGrid2
          container
          // small spacing porque controlamos gap en CSS/prop gap
          spacing={0}
          justifyContent="center"
          alignItems="flex-start"
          sx={{ gap: `var(--footer-col-gap, 16px)` }} // valor por defecto 16px
        >
          {/* Dirección */}
          <CustomGrid2 item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              {labelDirection}
            </Typography>
            <Typography variant="body2">{directionStreet}</Typography>
            <Typography variant="body2">{campusName}</Typography>
            <Typography variant="body2">{facultad}</Typography>
            <Typography variant="body2">{numLab}</Typography>
          </CustomGrid2>

          {/* Contacto */}
          <CustomGrid2 item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              {labelPhone}
            </Typography>
            <Typography variant="body2">{phone}</Typography>

            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 1 }}>
              {labelMail}
            </Typography>
            <Typography variant="body2">{mail}</Typography>
          </CustomGrid2>

          {/* Redes Sociales (solo iconos, 2 columnas internas) */}
          <CustomGrid2 item xs={12} sm={12} md={4}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              {labelSocial}
            </Typography>

            <Grid container spacing={0} className={styles.socialGrid}>
              {/* Primera columna de 3 */}
              <Grid item xs={6} className={styles.socialColumn}>
                {firstColumn.map((s, i) => {
                  const Icon = ICON_MAP[s.icon] || Language;
                  return (
                    <Link
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.name}
                      className={styles.socialLink}
                      aria-label={s.name}
                    >
                      <Icon fontSize="small" />
                    </Link>
                  );
                })}
              </Grid>

              {/* Segunda columna de 3 */}
              <Grid item xs={6} className={styles.socialColumn}>
                {secondColumn.map((s, i) => {
                  const Icon = ICON_MAP[s.icon] || Language;
                  return (
                    <Link
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.name}
                      className={styles.socialLink}
                      aria-label={s.name}
                    >
                      <Icon fontSize="small" />
                    </Link>
                  );
                })}
              </Grid>
            </Grid>
          </CustomGrid2>
        </CustomGrid2>
      </div>

      {/* Derechos de autor */}
      <div className={styles.coppyRight}>
        <Typography align="center" variant="body2">
          {footerText}
        </Typography>
        <Typography align="center" variant="body2">
          Powered by OzzyJames11
        </Typography>
      </div>
    </footer>
  );
};

export default Footer;
