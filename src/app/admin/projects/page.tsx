"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import Link from "next/link";
import AdminTable from "@components/components/admin/AdminTable";
import EntityModal from "@components/components/admin/EntityModal";
import DeleteConfirm from "@components/components/admin/DeleteConfirm";
import ProjectForm, { ProjectFormData } from "@components/components/admin/forms/ProjectForm";

type Project = ProjectFormData & { id: string };

const EMPTY: ProjectFormData = {
  title_en: "", title_id: "", description_en: "", description_id: "",
  link: "", order: 0, project_by: "self", is_detail: false, dev_stack: [], thumbnail: "",
};

export default function ProjectsAdminPage() {
  const [data,     setData]     = useState<Project[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [form,     setForm]     = useState<ProjectFormData>(EMPTY);

  const fetch = useCallback(async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "projects"));
    setData(snap.docs.map(d => ({ id: d.id, ...d.data() } as Project)).sort((a, b) => b.order - a.order));
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openAdd = () => { setSelected(null); setForm(EMPTY); setModal(true); };

  const openEdit = (item: Project) => {
    setSelected(item);
    const { id, ...rest } = item;
    void id;
    setForm(rest);
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    if (selected) {
      await updateDoc(doc(db, "projects", selected.id), form as unknown as Record<string, unknown>);
    } else {
      await addDoc(collection(db, "projects"), form);
    }
    setSaving(false);
    setModal(false);
    fetch();
  };

  const remove = async () => {
    if (!deleteId) return;
    await deleteDoc(doc(db, "projects", deleteId));
    setDeleteId(null);
    fetch();
  };

  const reorder = async (newItems: Project[]) => {
    setData(newItems);
    const batch = writeBatch(db);
    newItems.forEach((item, idx) => {
      batch.update(doc(db, "projects", item.id), { order: newItems.length - idx });
    });
    await batch.commit();
  };

  return (
    <>
      <AdminTable
        title="Projects"
        columns={[
          { key: "title_en",   label: "Title (EN)" },
          { key: "project_by", label: "By"         },
          { key: "dev_stack",  label: "Stack",      render: (p) => `${p.dev_stack.length} techs` },
          { key: "is_detail",  label: "Detail",    render: (p) => p.is_detail ? "✓" : "—" },
          { key: "order",      label: "Order"      },
        ]}
        data={data}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={id => setDeleteId(id)}
        onReorder={reorder}
        extraActions={(item) =>
          item.is_detail ? (
            <Link
              href={`/admin/projects/${item.id}`}
              className="px-3 py-1.5 rounded-lg bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-300 text-xs transition-colors"
            >
              Detail
            </Link>
          ) : null
        }
      />
      <EntityModal title={selected ? "Edit Project" : "Add Project"} open={modal} onClose={() => setModal(false)} onSave={save} saving={saving} wide>
        <ProjectForm data={form} onChange={setForm} />
      </EntityModal>
      <DeleteConfirm open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={remove} />
    </>
  );
}
