import { fetchGetAllCommentStart, fetchGetAllReviewStart, selectAllComment, selectAllReview } from "@/store/review";
import { useDispatch, useSelector } from "react-redux";

export function useReview() {
    const dispatch = useDispatch();
    const allReview: any = useSelector(selectAllReview);
    const allComment: any = useSelector(selectAllComment);
  
    const fetchGetAllReview = (id: any,
      onSuccess: () => void,
      onFailure: () => void) => {
      // console.log("Dispatching fetchGetAllReviewStart action with id:", id);
      dispatch(fetchGetAllReviewStart({
        id: id,
        onSuccess: onSuccess,
        onFailure: onFailure,
      }));
    };
    const fetchGetAllComment = (id: any,
      onSuccess: () => void,
      onFailure: () => void) => {
      console.log("Dispatching fetchGetAllCommentStart action with id:", id); 
        dispatch(fetchGetAllCommentStart({
          id: id,
          onSuccess: onSuccess,
          onFailure: onFailure,
        }));
      };

    

  return {
    allReview,
    fetchGetAllReview,

    allComment,
    fetchGetAllComment,


  };
}
