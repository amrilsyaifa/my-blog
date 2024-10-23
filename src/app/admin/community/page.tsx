"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import AdminTable from "@components/components/admin/AdminTable";
import EntityModal from "@components/components/admin/EntityModal";
import DeleteConfirm from "@components/components/admin/DeleteConfirm";
import CommunityForm, { CommunityFormData } from "@components/components/admin/forms/CommunityForm";

type Event = CommunityFormData & { id: string };

const EMPTY: CommunityFormData = {
  title_en: "", title_id: "", description_en: "", description_id: "",
  date: "", location: "", photos: [], order: 0,
};

export default function CommunityAdminPage() {
  const [data,     setData]     = useState<Event[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Event | null>(null);
  const [form,     setForm]     = useState<CommunityFormData>(EMPTY);

  const fetch = useCallback(async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "community"));
    setData(snap.docs.map(d => ({ id: d.id, ...d.data() } as Event)).sort((a, b) => b.order - a.order));
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openAdd = () => { setSelected(null); setForm(EMPTY); setModal(true); };

  const openEdit = (item: Event) => {
    setSelected(item);
    const { id, ...rest } = item;
    void id;
    setForm(rest);
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    if (selected) {
      await updateDoc(doc(db, "community", selected.id), form as unknown as Record<string, unknown>);
    } else {
      await addDoc(collection(db, "community"), form);
    }
    setSaving(false);
    setModal(false);
    fetch();
  };

  const remove = async () => {
    if (!deleteId) return;
    await deleteDoc(doc(db, "community", deleteId));
    setDeleteId(null);
    fetch();
  };

  const reorder = async (newItems: Event[]) => {
    setData(newItems);
    const batch = writeBatch(db);
    newItems.forEach((item, idx) => {
      batch.update(doc(db, "community", item.id), { order: newItems.length - idx });
    });
    await batch.commit();
  };

  return (
    <>
      <AdminTable
        title="Community Events"
        columns={[
          { key: "title_en", label: "Title (EN)" },
          { key: "date",     label: "Date"     },
          { key: "location", label: "Location" },
          { key: "photos",   label: "Photos",  render: (e) => `${e.photos.length} photo(s)` },
          { key: "order",    label: "Order"    },
        ]}
        data={data}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={id => setDeleteId(id)}
        onReorder={reorder}
      />
      <EntityModal title={selected ? "Edit Event" : "Add Event"} open={modal} onClose={() => setModal(false)} onSave={save} saving={saving} wide>
        <CommunityForm data={form} onChange={setForm} />
      </EntityModal>
      <DeleteConfirm open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={remove} />
    </>
  );
}
