"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import AdminTable from "@components/components/admin/AdminTable";
import EntityModal from "@components/components/admin/EntityModal";
import DeleteConfirm from "@components/components/admin/DeleteConfirm";
import CareerForm, { CareerFormData } from "@components/components/admin/forms/CareerForm";

type Career = CareerFormData & { id: string };

const EMPTY: CareerFormData = {
  job_title: "", job_tipe: "", job_location: "", company: "",
  company_address: "", company_url: "", start_date: "", end_date: "",
  is_active: false, dev_stack: [], company_order: 0,
  work_details: [], achievements: [],
};

export default function CareersAdminPage() {
  const [data,     setData]     = useState<Career[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Career | null>(null);
  const [form,     setForm]     = useState<CareerFormData>(EMPTY);

  const fetch = useCallback(async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "careers"));
    setData(snap.docs.map(d => ({ id: d.id, ...d.data() } as Career)).sort((a, b) => b.company_order - a.company_order));
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openAdd = () => { setSelected(null); setForm(EMPTY); setModal(true); };

  const openEdit = (item: Career) => {
    setSelected(item);
    const { id, ...rest } = item;
    void id;
    setForm(rest);
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    const payload = {
      ...form,
      work_details: (form.work_details ?? []).filter(s => s.trim() !== ""),
    };
    if (selected) {
      await updateDoc(doc(db, "careers", selected.id), payload as unknown as Record<string, unknown>);
    } else {
      await addDoc(collection(db, "careers"), payload);
    }
    setSaving(false);
    setModal(false);
    fetch();
  };

  const remove = async () => {
    if (!deleteId) return;
    await deleteDoc(doc(db, "careers", deleteId));
    setDeleteId(null);
    fetch();
  };

  const reorder = async (newItems: Career[]) => {
    setData(newItems);
    const batch = writeBatch(db);
    newItems.forEach((item, idx) => {
      batch.update(doc(db, "careers", item.id), { company_order: newItems.length - idx });
    });
    await batch.commit();
  };

  return (
    <>
      <AdminTable
        title="Careers"
        columns={[
          { key: "job_title",     label: "Job Title" },
          { key: "company",       label: "Company"   },
          { key: "job_tipe",      label: "Type"      },
          { key: "is_active",     label: "Active", render: (c) => (
            c.is_active
              ? <span className="text-green-400 text-xs">● Active</span>
              : <span className="text-slate-500 text-xs">● Past</span>
          )},
          { key: "company_order", label: "Order"     },
        ]}
        data={data}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={id => setDeleteId(id)}
        onReorder={reorder}
      />
      <EntityModal title={selected ? "Edit Career" : "Add Career"} open={modal} onClose={() => setModal(false)} onSave={save} saving={saving} wide>
        <CareerForm data={form} onChange={setForm} />
      </EntityModal>
      <DeleteConfirm open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={remove} />
    </>
  );
}
