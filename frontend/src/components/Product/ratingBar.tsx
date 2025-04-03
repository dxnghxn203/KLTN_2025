const ratings = [
  { stars: 5, percent: 100, count: "14.9K" },
  { stars: 4, percent: 10, count: "1,737" },
  { stars: 3, percent: 3, count: "534" },
  { stars: 2, percent: 1, count: "188" },
  { stars: 1, percent: 3, count: "527" },
];

export default function RatingBar() {
  return (
    <div className="w-full max-w-md space-y-2">
      {ratings.map((rating) => (
        <div key={rating.stars} className="flex items-center space-x-2">
          <span className="w-16">{rating.stars} sao</span>
          <div className="w-[250px] bg-gray-200 rounded-full relative">
            <div
              className="bg-[#FCD53F] h-2 rounded-full"
              style={{ width: `${rating.percent}%` }}
            ></div>
          </div>
          <div className="flex w-[80px] whitespace-nowrap">
            <span className="text-sm text-start">
              {rating.percent}%({rating.count})
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
