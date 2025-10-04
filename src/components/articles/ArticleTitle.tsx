import React from "react";

type Props = {
  title: string;
};

const ArticleTitle: React.FC<Props> = ({ title }) => {
  return (
    <h3 className="text-lg font-bold leading-tight text-gray-800 transition-colors duration-300 group-hover:text-emerald-700 line-clamp-2 min-h-[48px]">
      {title}
    </h3>
  );
};

export default ArticleTitle;
