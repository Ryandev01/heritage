import { Grid } from '@mui/material';
import login_bg from '../../assets/images/login_bg.webp';
import logo_with_name from '../../assets/images/logo_with_name.png';
import styles from "./index.module.css";

export const SideContent = () => {
  return (
    <Grid item sm={6} md={3} lg={4} xl={4} className={`${styles["sideGrid"]}`}>
      <div className={`${styles["bgImgContainer"]}`}>
        <img src={login_bg} className={`${styles["bgImg"]}`} alt="left-bg"/>
        <Grid display={'flex'} item alignItems={'center'} justifyContent={'center'}>

          <img src={logo_with_name} className={`${styles["logo"]}`} alt="logo"/>
        </Grid>
      </div>
    </Grid>
  )
}
