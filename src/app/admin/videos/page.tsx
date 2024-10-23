"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import AdminTable from "@components/components/admin/AdminTable";
import EntityModal from "@components/components/admin/EntityModal";
import DeleteConfirm from "@components/components/admin/DeleteConfirm";
import VideoForm, { VideoFormData } from "@components/components/admin/forms/VideoForm";

type Video = VideoFormData & { id: string };

const EMPTY: VideoFormData = { title: "", videoId: "", order: 0 };

export default function VideosAdminPage() {
  const [data,     setData]     = useState<Video[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Video | null>(null);
  const [form,     setForm]     = useState<VideoFormData>(EMPTY);

  const fetch = useCallback(async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "videos"));
    setData(snap.docs.map(d => ({ id: d.id, ...d.data() } as Video)).sort((a, b) => b.order - a.order));
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openAdd = () => { setSelected(null); setForm(EMPTY); setModal(true); };

  const openEdit = (item: Video) => {
    setSelected(item);
    const { id, ...rest } = item;
    void id;
    setForm(rest);
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    if (selected) {
      await updateDoc(doc(db, "videos", selected.id), form as unknown as Record<string, unknown>);
    } else {
      await addDoc(collection(db, "videos"), form);
    }
    setSaving(false);
    setModal(false);
    fetch();
  };

  const remove = async () => {
    if (!deleteId) return;
    await deleteDoc(doc(db, "videos", deleteId));
    setDeleteId(null);
    fetch();
  };

  const reorder = async (newItems: Video[]) => {
    setData(newItems);
    const batch = writeBatch(db);
    newItems.forEach((item, idx) => {
      batch.update(doc(db, "videos", item.id), { order: newItems.length - idx });
    });
    await batch.commit();
  };

  return (
    <>
      <AdminTable
        title="Videos"
        columns={[
          { key: "title",   label: "Title"    },
          { key: "videoId", label: "Video ID" },
          { key: "order",   label: "Order"    },
        ]}
        data={data}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={id => setDeleteId(id)}
        onReorder={reorder}
      />
      <EntityModal title={selected ? "Edit Video" : "Add Video"} open={modal} onClose={() => setModal(false)} onSave={save} saving={saving}>
        <VideoForm data={form} onChange={setForm} />
      </EntityModal>
      <DeleteConfirm open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={remove} />
    </>
  );
}
