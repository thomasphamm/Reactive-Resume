import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import { MagicWand, Plus } from "@phosphor-icons/react";
import { createResumeSchema, ResumeDto } from "@reactive-resume/dto";
import { Award, Certification, Education, Experience, Language, Profile, Project, Skill, idSchema } from "@reactive-resume/schema";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Tooltip,
} from "@reactive-resume/ui";
import { cn, generateRandomName, kebabCase } from "@reactive-resume/utils";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCreateResume } from "@/client/services/resume";
import { useDialog } from "@/client/stores/dialog";
import { BasicsSection } from "@/client/pages/builder/sidebars/left/sections/basics";
import { useResumeStore } from "@/client/stores/resume";
import { SectionBase } from "@/client/pages/builder/sidebars/left/sections/shared/section-base";
import { SummarySection } from "@/client/pages/builder/sidebars/left/sections/summary";

const formSchema = createResumeSchema.extend({ id: idSchema.optional() });

type FormValues = z.infer<typeof formSchema>;

export const OpenAIDialog = () => {
  const { isOpen, mode, payload, close } = useDialog<ResumeDto>("open-AI");
  const resume = useResumeStore((state) => state.resume);

  const isCreate = mode === "create";
  const [step, setStep] = useState<number>(1)
  const { createResume, loading: createLoading } = useCreateResume();

  const loading = createLoading

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", slug: "" },
  });
  useEffect(() => {
    setStep(1)
    form.reset({ title: "", slug: "" });
    useResumeStore.setState({ resume: {} as ResumeDto });
  }, [isOpen, payload])

  useEffect(() => {
    const slug = kebabCase(form.watch("title"));
    form.setValue("slug", slug);
  }, [form.watch("title")]);

  const onSubmit = async (values: FormValues) => {
    if (!resume.id && step == 1) {
      const resResume = await createResume({ slug: values.slug, title: values.title, visibility: "private" });
      useResumeStore.setState({ resume: resResume });
      useResumeStore.temporal.getState().clear();
      setStep(2);
    } 
  };

  const onGenerateRandomName = () => {
    const name = generateRandomName();
    form.setValue("title", name);
    form.setValue("slug", kebabCase(name));
  };

  const handleSetStep = (val: number) => {
    setStep(step + val)

  }
  const viewForm = useMemo(() =>{
    return     <div className="flex-1">
    {step == 1 &&
      <div>
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Title`}</FormLabel>
              <FormControl>
                <div className="flex items-center justify-between gap-x-2">
                  <Input {...field} className="flex-1" />

                    <Tooltip content={t`Generate a random title for your resume`}>
                      <Button
                        size="icon"
                        type="button"
                        variant="outline"
                        onClick={onGenerateRandomName}
                      >
                        <MagicWand />
                      </Button>
                    </Tooltip>
                </div>
              </FormControl>
              <FormDescription>
                {t`Tip: You can name the resume referring to the position you are applying for.`}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="slug"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Slug`}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>}
    {step == 2 && <BasicsSection />}
    {step == 3 && <SectionBase<Profile>
      id="profiles"
      title={(item) => item.network}
      description={(item) => item.username}
    />}
    {step == 4 && <SectionBase<Experience>
      id="experience"
      title={(item) => item.company}
      description={(item) => item.position}
    />}
    {step == 5 && <SectionBase<Education>
      id="education"
      title={(item) => item.institution}
      description={(item) => item.area}
    />}
    {step == 6 && <SectionBase<Skill>
      id="skills"
      title={(item) => item.name}
      description={(item) => {
        if (item.description) return item.description;
        if (item.keywords.length > 0) return `${item.keywords.length} keywords`;
      }}
    />}
    {step == 7 && <SectionBase<Language>
      id="languages"
      title={(item) => item.name}
      description={(item) => item.description}
    />}
    {step == 8 && <SectionBase<Award>
      id="awards"
      title={(item) => item.title}
      description={(item) => item.awarder}
    />}
    {step == 9 && <SectionBase<Project>
      id="projects"
      title={(item) => item.name}
      description={(item) => item.description}
    />}
    {step == 10 && <SectionBase<Certification>
      id="certifications"
      title={(item) => item.name}
      description={(item) => item.issuer}
    />}
    {step == 11 && <SummarySection />}
  </div>
  }
    , [step])

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="min-h-[650px] w-[800px]">
        <Form {...form}>
          <form className="space-y-4 flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center space-x-2.5">
                  <Plus />
                  <h2>
                    {isCreate && t`Create a new resume with OpenAI`}
                  </h2>
                </div>
              </DialogTitle>
              <DialogDescription>
                {step == 1 && t`Start building your resume by giving it a name.`}
              </DialogDescription>
            </DialogHeader>
            {viewForm}
            <DialogFooter>
              <div className="flex items-center gap-2">
                {step == 1 && <Button
                  type="submit"
                  disabled={loading}
                  className={cn(isCreate && "rounded-r-none")}
                >
                  {t`Create`}
                </Button>}
                {step > 2 && <Button
                type="button"
                  onClick={() => handleSetStep(-1)}
                  className={cn(isCreate && "rounded-r-none")}
                >
                  {t`Back`}
                </Button>}
                {step >= 2 && <Button
                  type="button"
                  onClick={() => handleSetStep(1)}
                  className={cn(isCreate && "rounded-r-none")}
                >
                  {t`Skip`}
                </Button>}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
