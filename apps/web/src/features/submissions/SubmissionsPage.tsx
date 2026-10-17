import { History } from "lucide-react";
import { useState } from "react";
import type { SubmissionKind } from "@beatcode/shared";
import { RequireAuth } from "@/app/RequireAuth";
import { PageContainer, PageHeader } from "@/components/PageContainer";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMySubmissions } from "./api";
import { SubmissionRow } from "./SubmissionRow";

function SubmissionList({ kind }: { kind: SubmissionKind }) {
  const submissions = useMySubmissions(kind);
  if (submissions.isPending) return <LoadingState />;
  if (submissions.isError)
    return <ErrorState error={submissions.error} onRetry={() => submissions.refetch()} />;

  const items = submissions.data.pages.flatMap((page) => page.items);
  if (items.length === 0) {
    return (
      <EmptyState icon={<History />} title="Nothing here yet">
        {kind === "SUBMIT"
          ? "Submit a solution to a problem to see it here."
          : "Run some code in the playground or a room."}
      </EmptyState>
    );
  }
  return (
    <>
      {items.map((s) => (
        <SubmissionRow key={s.id} submission={s} showProblem={kind === "SUBMIT"} />
      ))}
      {submissions.hasNextPage && (
        <div className="flex justify-center p-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => submissions.fetchNextPage()}
            loading={submissions.isFetchingNextPage}
          >
            Load more
          </Button>
        </div>
      )}
    </>
  );
}

export function SubmissionsPage() {
  const [kind, setKind] = useState<SubmissionKind>("SUBMIT");
  return (
    <PageContainer className="max-w-4xl">
      <PageHeader title="Submissions" description="Your solutions and code runs, newest first." />
      <RequireAuth reason="Sign in to see your submissions">
        <Tabs value={kind} onValueChange={(v) => setKind(v as SubmissionKind)} className="mb-4">
          <TabsList>
            <TabsTrigger value="SUBMIT">Problem submissions</TabsTrigger>
            <TabsTrigger value="PLAYGROUND">Playground & rooms</TabsTrigger>
          </TabsList>
        </Tabs>
        <Card className="overflow-hidden">
          <SubmissionList key={kind} kind={kind} />
        </Card>
      </RequireAuth>
    </PageContainer>
  );
}
