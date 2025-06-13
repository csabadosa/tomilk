type TitleProps = {
  title: string;
};

export default function Title({ title }: TitleProps) {
  return <h1 className="text-orange-900 text-xl font-extrabold border-b">{title}</h1>;
}
