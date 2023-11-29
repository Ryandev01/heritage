import { useEffect } from "react";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { addRemarks, getRemarks, editRemarks } from "../api/remarks";

const useRemarks = () => {
  const { uniqueId } = useParams<{ uniqueId: string }>();

  useEffect(() => {
    if (uniqueId) {
      getRemarksMutation(uniqueId)
    }
  }, [uniqueId])

  /**
   * add remarks api
   */
  const { isLoading: addLoading, error: addErr, data: addData, mutate: addRemarksMutation } = useMutation(addRemarks, {
    retry: false,
    onSuccess: () => {
      if (uniqueId) {
        getRemarksMutation(uniqueId);
      }
    }
  });
  /**
   * add remarks api
   */
  const { error: updateErr, data: updateData, mutate: updateRemarksMutation } = useMutation(editRemarks, {
    retry: false,
    onSuccess: () => {
      if (uniqueId) {
        getRemarksMutation(uniqueId);
      }
    }
  });
  /**
   * fetch remarks api
   */
  const { isLoading, error, data, mutate: getRemarksMutation } = useMutation(getRemarks, {
    retry: false
  });

  return {
    loading: isLoading,
    error,
    data,
    addRemarksMutation,
    getRemarksMutation,
    updateRemarksMutation
  };
};

export default useRemarks;
