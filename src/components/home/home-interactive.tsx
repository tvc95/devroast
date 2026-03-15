"use client";

import { useState } from "react";
import {
  ActionsBar,
  ActionsBarSubmit,
  ActionsBarToggle,
} from "@/components/home/actions-bar";
import { CodeInput } from "@/components/home/code-input";

export function HomeInteractive() {
  const [submitEnabled, setSubmitEnabled] = useState(true);

  return (
    <>
      <CodeInput onSubmitEnabled={setSubmitEnabled} />
      <ActionsBar>
        <ActionsBarToggle>roast mode</ActionsBarToggle>
        <ActionsBarSubmit disabled={!submitEnabled}>
          $ roast_my_code
        </ActionsBarSubmit>
      </ActionsBar>
    </>
  );
}
