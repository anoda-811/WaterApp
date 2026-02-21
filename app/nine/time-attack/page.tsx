import TimeAttack from "./TimeAttack";

type Props = {
  searchParams: Promise<{
    seconds?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const seconds = Number(params?.seconds ?? 60);

  return <TimeAttack seconds={seconds} />;
}