"use client";

import dynamic from "next/dynamic";
import Quill from "quill";

import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="border rounded-lg p-2 w-full h-32 bg-gray-50">
      Đang tải editor...
    </div>
  ),
}) as any;
const Parchment = Quill.import("parchment");
const LineHeightStyle = new Parchment.Attributor.Style(
  "lineheight",
  "line-height",
  {
    scope: Parchment.Scope.BLOCK,
  }
);
Quill.register(LineHeightStyle, true);

export const toolbarOptions = [
  [{ header: [1, 2, 3, 4, false] }],
  [{ font: [] }],
  [{ size: [] }],
  ["bold", "italic", "underline", "strike", "blockquote"],
  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  [{ lineheight: ["1", "1.5", "2", "2.5", "3"] }],
  ["link", "image", "video"],
  ["clean"],
];

interface DynamicQuillProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export default function DynamicReactQuill({
  value,
  onChange,
  readOnly = false,
}: DynamicQuillProps) {
  return (
    <div className="custom-quill [&_.ql-editor]:leading-7">
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={{ toolbar: toolbarOptions }}
        readOnly={readOnly}
        theme="snow"
      />
    </div>
  );
}
