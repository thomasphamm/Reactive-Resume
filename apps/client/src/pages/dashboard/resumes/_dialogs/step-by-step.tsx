import { useDialog } from "@/client/stores/dialog";
import { Plus } from "@phosphor-icons/react";
import {
    Dialog,
    DialogContent
} from "@reactive-resume/ui";
import { useEffect } from "react";
import { BaseCard } from "../_layouts/grid/_components/base-card";
import { useResumeStore } from "@/client/stores/resume";
import { ResumeDto } from "@reactive-resume/dto";

export const StepByStep = () => {
    const { isOpen, mode, payload, close } = useDialog<any>("step-by-step");
    const { open: resumeOpen } = useDialog<any>("resume");
    const { open: OpenAIDialog } = useDialog<any>("open-AI");

    useEffect(() => {
        if (isOpen) onReset();
    }, [isOpen, payload]);

    const onReset = () => {

    };
    const onOpenAIDialog = () => {
      useResumeStore.setState({ resume: {} as ResumeDto });
      OpenAIDialog("create")
    }
    return <Dialog open={isOpen} onOpenChange={close} >
        <DialogContent className="">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-2">
                <BaseCard className="flex-1" onClick={() => resumeOpen("create")}>
                    <Plus size={64} weight="thin" />
                    <h4>Create a new resume</h4>
                </BaseCard>
                <BaseCard className="flex-1" onClick={onOpenAIDialog}>
                    <Plus size={64} weight="thin" />
                    <h4>Create a new resume with AI</h4>
                </BaseCard>
            </div>
        </DialogContent>
    </Dialog>
}