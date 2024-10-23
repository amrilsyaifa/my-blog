"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import AdminTable from "@components/components/admin/AdminTable";
import EntityModal from "@components/components/admin/EntityModal";
import DeleteConfirm from "@components/components/admin/DeleteConfirm";
import BlogForm, { BlogFormData } from "@components/components/admin/forms/BlogForm";

type Blog = BlogFormData & { id: string };

const EMPTY: BlogFormData = { title_en: "", title_id: "", description_en: "", description_id: "", url: "", date: "", order: 0, thumbnail: "" };

export default function BlogsAdminPage() {
  const [data,     setData]     = useState<Blog[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Blog | null>(null);
  const [form,     setForm]     = useState<BlogFormData>(EMPTY);

  const fetch = useCallback(async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "blogs"));
    setData(snap.docs.map(d => ({ id: d.id, ...d.data() } as Blog)).sort((a, b) => b.order - a.order));
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openAdd = () => { setSelected(null); setForm(EMPTY); setModal(true); };

  const openEdit = (item: Blog) => {
    setSelected(item);
    const { id, ...rest } = item;
    void id;
    setForm(rest);
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    if (selected) {
      await updateDoc(doc(db, "blogs", selected.id), form as unknown as Record<string, unknown>);
    } else {
      await addDoc(collection(db, "blogs"), form);
    }
    setSaving(false);
    setModal(false);
    fetch();
  };

  const remove = async () => {
    if (!deleteId) return;
    await deleteDoc(doc(db, "blogs", deleteId));
    setDeleteId(null);
    fetch();
  };

  const reorder = async (newItems: Blog[]) => {
    setData(newItems);
    const batch = writeBatch(db);
    newItems.forEach((item, idx) => {
      batch.update(doc(db, "blogs", item.id), { order: newItems.length - idx });
    });
    await batch.commit();
  };

  return (
    <>
      <AdminTable
        title="Blogs"
        columns={[
          { key: "title_en", label: "Title (EN)" },
          { key: "title_id", label: "Title (ID)", render: (b) => b.title_id || "—" },
          { key: "date",     label: "Date"        },
          { key: "order",    label: "Order"       },
        ]}
        data={data}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={id => setDeleteId(id)}
        onReorder={reorder}
      />
      <EntityModal title={selected ? "Edit Blog" : "Add Blog"} open={modal} onClose={() => setModal(false)} onSave={save} saving={saving}>
        <BlogForm data={form} onChange={setForm} />
      </EntityModal>
      <DeleteConfirm open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={remove} />
    </>
  );
}
