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
import { useOpenAiStore } from "@/client/stores/openai";

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
    const { apiKey, setApiKey } = useOpenAiStore();
 
    useEffect(() => {
        const timeoutFunc = setTimeout(() => {
            setApiKey(import.meta.env.REACT_APP_API_URL); 
        }, 1000);
        return () => {
            clearTimeout(timeoutFunc)
        }
    }, [])
    return <Dialog open={isOpen} onOpenChange={close} >
        <DialogContent className="">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
                <BaseCard className="flex-1" onClick={() => resumeOpen("create")}>
                    <div className="">
                        <img src="icon/experience.png" alt="" width={120} height={120} />
                        <h4>Create a new resume</h4>
                    </div>
                </BaseCard>
                <BaseCard className="flex-1" onClick={onOpenAIDialog}>
                    <div className="">
                        <img src="icon/ai.png" alt=""  width={120} height={120} />
                    <h4>Create a new resume with AI</h4>

                    </div>
                </BaseCard>
            </div>
        </DialogContent>
    </Dialog>
}