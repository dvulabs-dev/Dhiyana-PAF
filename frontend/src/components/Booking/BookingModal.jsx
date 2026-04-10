import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { createBooking, getBookingSlots } from '../../services/bookingApi';
import { toast } from 'react-hot-toast';
import { X, Clock, FileText, Users, Calendar, AlertTriangle, Info } from 'lucide-react';
import { format } from 'date-fns';

const BookingModal = ({ resource, onClose, onSuccess }) => {
    const [step, setStep] = useState(1); // 1 = pick date+slot, 2 = fill details
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [busyEvents, setBusyEvents] = useState([]);
    const [calendarLoading, setCalendarLoading] = useState(false);

    const [formData, setFormData] = useState({
        startTime: '',
        endTime: '',
        purpose: '',
        expectedAttendees: resource.minAttendees || 1,
    });
    const [submitting, setSubmitting] = useState(false);

    // Constraints from resource
    const maxHours = resource.maxBookingHours || 0;
    const minAtt   = resource.minAttendees || 0;
    const maxAtt   = resource.maxAttendees || resource.capacity || 100;

    // Load busy slots for selected date
    const loadSlots = useCallback(async (date) => {
        setCalendarLoading(true);
        try {
            const slots = await getBookingSlots(resource.id, date);
            const events = slots.map(b => ({
                id: b.id,
                title: 'Booked',
                start: b.startTime,
                end: b.endTime,
                backgroundColor: '#ef4444',
                borderColor: '#dc2626',
                textColor: '#fff',
                display: 'background',
            }));
            setBusyEvents(events);
        } catch {
            // silently ignore
        } finally {
            setCalendarLoading(false);
        }
    }, [resource.id]);

    useEffect(() => {
        loadSlots(selectedDate);
    }, [selectedDate, loadSlots]);

    // When user selects a time slot on the calendar
    const handleSelect = (info) => {
        const start = info.start;
        const end   = info.end;

        if (maxHours > 0) {
            const diffH = (end - start) / 3600000;
            if (diffH > maxHours) {
                toast.error(`Max booking duration is ${maxHours} hour(s) for this resource.`);
                return;
            }
        }

        setFormData(prev => ({
            ...prev,
            startTime: format(start, "yyyy-MM-dd'T'HH:mm"),
            endTime:   format(end,   "yyyy-MM-dd'T'HH:mm"),
        }));
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate attendees
        const att = Number(formData.expectedAttendees);
        if (minAtt > 0 && att < minAtt) {
            toast.error(`Minimum ${minAtt} attendees required.`);
            return;
        }
        if (maxAtt > 0 && att > maxAtt) {
            toast.error(`Maximum ${maxAtt} attendees allowed.`);
            return;
        }

        setSubmitting(true);
        try {
            await createBooking({
                resourceId: resource.id,
                startTime: formData.startTime,
                endTime: formData.endTime,
                purpose: formData.purpose,
                expectedAttendees: att,
            });
            toast.success('Booking submitted! Pending admin approval.');
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Booking failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatSlot = (dt) => {
        if (!dt) return '—';
        return new Date(dt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-5 text-white flex justify-between items-start flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-black">Reserve: {resource.name}</h2>
                        <p className="text-blue-100 text-sm mt-1">
                            {resource.building} · {resource.floor} · {resource.roomCode || resource.location}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-blue-200 font-medium">
                            <span>👥 Capacity: {resource.capacity}</span>
                            {maxHours > 0 && <span>⏱ Max {maxHours}h per booking</span>}
                            {minAtt > 0 && <span>👤 Min {minAtt} attendees</span>}
                            {maxAtt > 0 && <span>👤 Max {maxAtt} attendees</span>}
                        </div>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Constraint notice for library rooms */}
                {minAtt > 0 && (
                    <div className="flex items-center gap-2 bg-amber-50 border-b border-amber-100 px-6 py-2.5 text-amber-800 text-xs font-medium">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        This room is for groups of {minAtt}–{maxAtt} people. Max {maxHours} hour(s) per booking.
                    </div>
                )}

                {/* Step indicator */}
                <div className="flex border-b border-slate-100 px-6 pt-4 pb-0 gap-6 flex-shrink-0">
                    {[{ n: 1, label: 'Pick Time Slot' }, { n: 2, label: 'Booking Details' }].map(s => (
                        <button
                            key={s.n}
                            onClick={() => step > s.n && setStep(s.n)}
                            className={`pb-3 text-sm font-bold border-b-2 transition-all ${step === s.n ? 'border-blue-600 text-blue-600' : step > s.n ? 'border-transparent text-slate-400 hover:text-slate-700' : 'border-transparent text-slate-300 cursor-default'}`}
                        >
                            {s.n}. {s.label}
                        </button>
                    ))}
                </div>

                <div className="overflow-y-auto flex-1 p-6">
                    {/* ── STEP 1: Calendar ─────────────────────────── */}
                    {step === 1 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    <span>Select a date, then drag a free slot to book it</span>
                                </div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    Date:
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        min={format(new Date(), 'yyyy-MM-dd')}
                                        onChange={e => setSelectedDate(e.target.value)}
                                        className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700"
                                    />
                                </label>
                            </div>

                            {/* Legend */}
                            <div className="flex gap-4 mb-4 text-xs font-semibold">
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-400 inline-block"></span>Already booked</span>
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500 inline-block"></span>Your selection</span>
                            </div>

                            {calendarLoading && (
                                <div className="flex justify-center py-4">
                                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}

                            <div className={`rounded-2xl overflow-hidden border border-slate-200 ${calendarLoading ? 'opacity-50' : ''}`}>
                                <FullCalendar
                                    plugins={[timeGridPlugin, interactionPlugin]}
                                    initialView="timeGridDay"
                                    initialDate={selectedDate}
                                    key={selectedDate}
                                    headerToolbar={false}
                                    allDaySlot={false}
                                    selectable={true}
                                    selectMirror={true}
                                    height={420}
                                    slotMinTime={resource.availableFrom || '08:00'}
                                    slotMaxTime={resource.availableTo || '20:00'}
                                    slotDuration="00:30:00"
                                    events={busyEvents}
                                    select={handleSelect}
                                    selectConstraint={{ start: new Date().toISOString() }}
                                    eventOverlap={false}
                                    selectOverlap={false}
                                    eventColor="#3b82f6"
                                />
                            </div>

                            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                                <Info className="w-3.5 h-3.5" />
                                Drag on the calendar to select your desired time slot.
                                {maxHours > 0 && ` Maximum ${maxHours} hour(s) per booking.`}
                            </p>
                        </div>
                    )}

                    {/* ── STEP 2: Details form ──────────────────────── */}
                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Selected slot summary */}
                            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                                <p className="text-xs font-black uppercase tracking-widest text-blue-500 mb-1">Selected Slot</p>
                                <div className="flex flex-col sm:flex-row gap-3 text-sm font-semibold text-slate-700">
                                    <span className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-500" />
                                        Start: {formatSlot(formData.startTime)}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        End: {formatSlot(formData.endTime)}
                                    </span>
                                </div>
                                <button type="button" onClick={() => setStep(1)} className="mt-2 text-xs text-blue-500 hover:underline">
                                    ← Change time slot
                                </button>
                            </div>

                            {/* Attendees */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-500" />
                                    Expected Attendees
                                    {minAtt > 0 && <span className="text-xs text-amber-600 font-normal">({minAtt}–{maxAtt} required)</span>}
                                </label>
                                <input
                                    type="number"
                                    min={minAtt || 1}
                                    max={maxAtt || resource.capacity}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-blue-200 focus:ring-2"
                                    value={formData.expectedAttendees}
                                    onChange={e => setFormData(p => ({ ...p, expectedAttendees: e.target.value }))}
                                />
                            </div>

                            {/* Purpose */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    Purpose of Use
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="e.g., Group study, Workshop, Team meeting, Lab session..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-blue-200 focus:ring-2 resize-none"
                                    value={formData.purpose}
                                    onChange={e => setFormData(p => ({ ...p, purpose: e.target.value }))}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3.5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Submit Booking Request'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
