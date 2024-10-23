"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import AdminTable from "@components/components/admin/AdminTable";
import EntityModal from "@components/components/admin/EntityModal";
import DeleteConfirm from "@components/components/admin/DeleteConfirm";
import SkillForm, { SkillFormData } from "@components/components/admin/forms/SkillForm";

type Skill = SkillFormData & { id: string };

const EMPTY: SkillFormData = { name: "", data: [], skill_order: 0 };

export default function SkillsAdminPage() {
  const [data,     setData]     = useState<Skill[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Skill | null>(null);
  const [form,     setForm]     = useState<SkillFormData>(EMPTY);

  const fetch = useCallback(async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "skills"));
    setData(snap.docs.map(d => ({ id: d.id, ...d.data() } as Skill)).sort((a, b) => b.skill_order - a.skill_order));
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openAdd = () => { setSelected(null); setForm(EMPTY); setModal(true); };

  const openEdit = (item: Skill) => {
    setSelected(item);
    const { id, ...rest } = item;
    void id;
    setForm(rest);
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    if (selected) {
      await updateDoc(doc(db, "skills", selected.id), form as unknown as Record<string, unknown>);
    } else {
      await addDoc(collection(db, "skills"), form);
    }
    setSaving(false);
    setModal(false);
    fetch();
  };

  const remove = async () => {
    if (!deleteId) return;
    await deleteDoc(doc(db, "skills", deleteId));
    setDeleteId(null);
    fetch();
  };

  const reorder = async (newItems: Skill[]) => {
    setData(newItems);
    const batch = writeBatch(db);
    newItems.forEach((item, idx) => {
      batch.update(doc(db, "skills", item.id), { skill_order: newItems.length - idx });
    });
    await batch.commit();
  };

  return (
    <>
      <AdminTable
        title="Skills"
        columns={[
          { key: "name",        label: "Category" },
          { key: "data",        label: "Items",   render: (s) => `${s.data.length} skills` },
          { key: "skill_order", label: "Order"    },
        ]}
        data={data}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={id => setDeleteId(id)}
        onReorder={reorder}
      />
      <EntityModal title={selected ? "Edit Skill" : "Add Skill"} open={modal} onClose={() => setModal(false)} onSave={save} saving={saving}>
        <SkillForm data={form} onChange={setForm} />
      </EntityModal>
      <DeleteConfirm open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={remove} />
    </>
  );
}
