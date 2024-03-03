import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import { CaretDown, Flask, MagicWand, Plus, PlusCircle } from "@phosphor-icons/react";
import { createResumeSchema, ResumeDto } from "@reactive-resume/dto";
import { Award, Certification, CustomSection, Education, Experience, Language, Profile, Project, Skill, idSchema, sampleResume } from "@reactive-resume/schema";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@reactive-resume/ui";
import { cn, generateRandomName, kebabCase } from "@reactive-resume/utils";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { printResume, useCreateResume } from "@/client/services/resume";
import { useDialog } from "@/client/stores/dialog";
import { BasicsSection } from "@/client/pages/builder/sidebars/left/sections/basics";
import { useResumeStore } from "@/client/stores/resume";
import { SectionBase } from "@/client/pages/builder/sidebars/left/sections/shared/section-base";
import { SummarySection } from "@/client/pages/builder/sidebars/left/sections/summary";
import { useImportResume } from "@/client/services/resume/import";
import { SectionIcon } from "@/client/pages/builder/sidebars/left/sections/shared/section-icon";
import { TemplateSection } from "@/client/pages/builder/sidebars/right/sections/template";
import { BaseCard } from "../_layouts/grid/_components/base-card";
import { useNavigate } from "react-router-dom";

const formSchema = createResumeSchema.extend({ id: idSchema.optional() });

type FormValues = z.infer<typeof formSchema>;

export const OpenAIDialog = () => {
  const { isOpen, mode, payload, close } = useDialog<ResumeDto>("open-AI");
  const resume = useResumeStore((state) => state.resume);
  const customSections = useResumeStore((state) => state?.resume?.data?.sections?.custom);
  const addSection = useResumeStore((state) => state.addSection);

  const isCreate = mode === "create";
  const [step, setStep] = useState<number>(1)
  const { createResume, loading: createLoading } = useCreateResume();
  const { importResume: duplicateResume, loading: duplicateLoading } = useImportResume();
  const navigate = useNavigate();

  const loading = createLoading

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", slug: "" },
  });
  useEffect(() => {
    if (!resume.id) {
      setStep(1)
      form.reset({ title: "", slug: "" });
      useResumeStore.setState({ resume: {} as ResumeDto });
    }
  }, [payload, isOpen])

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
  const onCreateSample = async () => {
    const randomName = generateRandomName();
    const { title, slug } = form.getValues();

    await duplicateResume({
      title: title || randomName,
      slug: slug || kebabCase(randomName),
      data: sampleResume,
    });

    close();
  };
  const onGenerateRandomName = () => {
    const name = generateRandomName();
    form.setValue("title", name);
    form.setValue("slug", kebabCase(name));
  };

  const onPdfExport = async () => {
    const { resume } = useResumeStore.getState();
    const { url } = await printResume({ id: resume.id });

    const openInNewTab = (url: string) => {
      const win = window.open(url, "_blank");
      if (win) win.focus();
    };

    openInNewTab(url);
  };
  
  const handleSetStep = (val: number) => {
    setStep(step + val)
  }
  const onOpen = () => {
    navigate(`/builder/${resume.id}`);
    close();
  };

  const viewForm = useMemo(() => {
    return <div className={step!=13? 'flex-1':'flex-1 flex items-center w-full justify-center'} >
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
      {step == 11 && customSections && Object.values(customSections).map((section) => (
        <Fragment key={section.id}>
          <SectionBase<CustomSection>
            id={`custom.${section.id}`}
            title={(item) => item.name}
            description={(item) => item.description}
          />
        </Fragment>
      ))}
      {step == 11 &&
        <Button className="mt-4" size="lg" variant="outline" onClick={addSection}>
          <PlusCircle />
          <span className="ml-2">{t`Add a new section`}</span>
        </Button>
      }
      {step == 12 &&
        <div className="h-[800px] overflow-x-auto">
          <TemplateSection />
        </div>
      }
      {step == 13 &&
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <BaseCard className="flex-1" onClick={onPdfExport}>
            <h4>Download the CV</h4>
          </BaseCard>
          <BaseCard className="flex-1 p-3" onClick={onOpen}>
            <h4>Edit the CV in Expert Mode.</h4>
          </BaseCard>
        </div>

      }
    </div>
  }
    , [step, customSections])

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
            <div className="flex gap-x-2 flex-1">
              {step >= 2 && step != 13 &&
                <div className="flex flex-col items-center gap-y-2">
                  < SectionIcon
                    id="basics"
                    onClick={() => setStep(2)}
                    name={t({
                      message: "Basics",
                      context:
                        "The basics section of a resume consists of User's Picture, Full Name, Location etc.",
                    })}
                  />
                  <SectionIcon id="profiles" onClick={() => setStep(3)} />
                  <SectionIcon id="experience" onClick={() => setStep(4)} />
                  <SectionIcon id="education" onClick={() => setStep(5)} />
                  <SectionIcon id="skills" onClick={() => setStep(6)} />
                  <SectionIcon id="languages" onClick={() => setStep(7)} />
                  <SectionIcon id="awards" onClick={() => setStep(8)} />
                  <SectionIcon id="projects" onClick={() => setStep(9)} />
                  <SectionIcon id="certifications" onClick={() => setStep(10)} />
                  <SectionIcon
                    id="custom"
                    variant="outline"
                    name={t`Add a new section`}
                    icon={<Plus size={14} />}
                    onClick={() => setStep(11)}
                  />
                </div>
              }
              {viewForm}
            </div>
            {step!= 13 && <DialogFooter>
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
                  {t`Next`}
                </Button>}
                {isCreate && step == 1 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" size="icon" className="rounded-l-none border-l">
                        <CaretDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="center">
                      <DropdownMenuItem onClick={onCreateSample}>
                        <Flask className="mr-2" />
                        {t`Create Sample Resume`}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </DialogFooter>}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
