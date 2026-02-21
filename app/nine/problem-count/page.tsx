import ProblemAttack from "./ProblemAttack";

type Props = {
  searchParams: Promise<{
    count?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const total = Number(params?.count ?? 60);

  return <ProblemAttack total={total} />;
}