"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import AdminTable from "@components/components/admin/AdminTable";
import EntityModal from "@components/components/admin/EntityModal";
import DeleteConfirm from "@components/components/admin/DeleteConfirm";
import CertificationForm, { CertificationFormData } from "@components/components/admin/forms/CertificationForm";

type Cert = CertificationFormData & { id: string };

const EMPTY: CertificationFormData = { title: "", issuer: "", href: "", badge: "", color: "#6366f1", order: 0 };

export default function CertificationsAdminPage() {
  const [data,     setData]     = useState<Cert[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Cert | null>(null);
  const [form,     setForm]     = useState<CertificationFormData>(EMPTY);

  const fetch = useCallback(async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "certifications"));
    setData(snap.docs.map(d => ({ id: d.id, ...d.data() } as Cert)).sort((a, b) => b.order - a.order));
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openAdd = () => { setSelected(null); setForm(EMPTY); setModal(true); };

  const openEdit = (item: Cert) => {
    setSelected(item);
    const { id, ...rest } = item;
    void id;
    setForm(rest);
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    if (selected) {
      await updateDoc(doc(db, "certifications", selected.id), form as unknown as Record<string, unknown>);
    } else {
      await addDoc(collection(db, "certifications"), form);
    }
    setSaving(false);
    setModal(false);
    fetch();
  };

  const remove = async () => {
    if (!deleteId) return;
    await deleteDoc(doc(db, "certifications", deleteId));
    setDeleteId(null);
    fetch();
  };

  const reorder = async (newItems: Cert[]) => {
    setData(newItems);
    const batch = writeBatch(db);
    newItems.forEach((item, idx) => {
      batch.update(doc(db, "certifications", item.id), { order: newItems.length - idx });
    });
    await batch.commit();
  };

  return (
    <>
      <AdminTable
        title="Certifications"
        columns={[
          { key: "title",  label: "Title"  },
          { key: "issuer", label: "Issuer" },
          { key: "badge",  label: "Badge", render: (c) => (
            c.badge.startsWith("http")
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={c.badge} alt="" className="w-8 h-8 object-contain" />
              : <span className="text-xl">{c.badge}</span>
          )},
          { key: "order",  label: "Order"  },
        ]}
        data={data}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={id => setDeleteId(id)}
        onReorder={reorder}
      />
      <EntityModal title={selected ? "Edit Certification" : "Add Certification"} open={modal} onClose={() => setModal(false)} onSave={save} saving={saving}>
        <CertificationForm data={form} onChange={setForm} />
      </EntityModal>
      <DeleteConfirm open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={remove} />
    </>
  );
}
