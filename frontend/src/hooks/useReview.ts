import { fetchCommentStart, fetchGetAllCommentStart, fetchGetAllReviewStart, fetchReviewStart, insertCommentSelector, insertReviewSelector, selectAllComment, selectAllReview } from "@/store/review";
import { useDispatch, useSelector } from "react-redux";

export function useReview() {
    const dispatch = useDispatch();
    const allReview: any = useSelector(selectAllReview);
    const allComment: any = useSelector(selectAllComment);
    const insertReview: any = useSelector(insertReviewSelector);
    const insertComment: any = useSelector(insertCommentSelector);
  
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
    const fetchInsertReview = ({
      param, onSuccess, onFailure
    }: {
      param: any;
      onSuccess: (message: string) => void;
      onFailure: (message: string) => void;
    }) => {
      dispatch(fetchReviewStart({
        ...param,
        onSuccess,
        onFailure
      }));
      console.log("Dispatching fetchInsertReview action with param:", param);
    };
    const fetchInsertComment = ({
      param, onSuccess, onFailure
    }: {
      param: any;
      onSuccess: (message: string) => void;
      onFailure: (message: string) => void;
    }) => {
      dispatch(fetchCommentStart({
        ...param,
        onSuccess,
        onFailure
      }));
      console.log("Dispatching fetchInsertComment action with param:", param);
    };


    

  return {
    allReview,
    fetchGetAllReview,

    allComment,
    fetchGetAllComment,

    insertReview,
    fetchInsertReview,

    insertComment,
    fetchInsertComment,


  };
}
