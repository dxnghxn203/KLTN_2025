import { useState } from "react";

interface ReplyFormProps {
  onSubmit: (reply: string) => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ onSubmit }) => {
  const [reply, setReply] = useState("");

  return (
    <div className="mt-2">
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Nhập phản hồi..."
      />
      <button className="mt-2" onClick={() => onSubmit(reply)}>
        Gửi
      </button>
    </div>
  );
};

export default ReplyForm;
