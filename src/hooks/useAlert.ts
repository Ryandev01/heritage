import { VariantType, useSnackbar } from 'notistack';

const useAlert = () => {

  const { enqueueSnackbar } = useSnackbar();

  const handleAlert = (str: string, variant?: VariantType) => {
    enqueueSnackbar(str, {variant: variant || 'success'});
  };

  return {
    handleAlert
  }
}

export default useAlert;
