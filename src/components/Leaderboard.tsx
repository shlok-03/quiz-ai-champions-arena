import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trophy, ArrowLeft, Crown, Medal, Award, Pencil, Trash2, Check, X, Plus } from 'lucide-react';
import {
  fetchQuizResults,
  insertQuizResult,
  updateQuizResult,
  deleteQuizResult,
  QuizResultRow,
} from '@/integrations/external-supabase';
import { toast } from '@/hooks/use-toast';

interface LeaderboardProps {
  onBack: () => void;
}

interface EditState {
  player_name: string;
  score: string;
  category: string;
}

const emptyForm = { player_name: '', score: '', total_questions: '', category: '' };

const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const [entries, setEntries] = useState<QuizResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditState>({ player_name: '', score: '', category: '' });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const rows = await fetchQuizResults(100);
      setEntries(rows);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.player_name || !form.category || !form.score || !form.total_questions) {
      toast({ title: 'Missing fields', description: 'Please fill in all fields.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await insertQuizResult({
        player_name: form.player_name,
        score: Number(form.score),
        total_questions: Number(form.total_questions),
        category: form.category,
      });
      setForm(emptyForm);
      toast({ title: 'Score added', description: 'New entry saved.' });
      await refresh();
    } catch (err: any) {
      toast({ title: 'Failed to add', description: err.message ?? 'Error', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (entry: QuizResultRow) => {
    setEditingId(entry.id ?? null);
    setEditValues({
      player_name: entry.player_name,
      score: String(entry.score),
      category: entry.category,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    try {
      await updateQuizResult(id, {
        player_name: editValues.player_name,
        score: Number(editValues.score),
        category: editValues.category,
      });
      setEditingId(null);
      toast({ title: 'Updated', description: 'Entry saved.' });
      await refresh();
    } catch (err: any) {
      toast({ title: 'Failed to update', description: err.message ?? 'Error', variant: 'destructive' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteQuizResult(deleteId);
      toast({ title: 'Deleted', description: 'Entry removed.' });
      await refresh();
    } catch (err: any) {
      toast({ title: 'Failed to delete', description: err.message ?? 'Error', variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-5 w-5 text-yellow-400" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-300" />;
    if (index === 2) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-muted-foreground text-sm font-mono w-5 text-center">{index + 1}</span>;
  };

  const formatDate = (iso?: string) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background bg-grid-pattern relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-accent/10 blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-4xl relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
          <Trophy className="h-8 w-8 text-accent animate-float" />
          <h1 className="text-3xl font-bold font-display text-foreground">Leaderboard</h1>
        </div>

        <form
          onSubmit={handleCreate}
          className="glass-strong rounded-2xl p-4 mb-4 animate-slide-in-bottom grid grid-cols-1 sm:grid-cols-5 gap-2"
        >
          <Input
            placeholder="Player name"
            value={form.player_name}
            onChange={(e) => setForm({ ...form, player_name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Score"
            value={form.score}
            onChange={(e) => setForm({ ...form, score: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Total"
            value={form.total_questions}
            onChange={(e) => setForm({ ...form, total_questions: e.target.value })}
          />
          <Input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <Button type="submit" disabled={submitting} className="font-semibold">
            <Plus className="mr-1 h-4 w-4" /> Add
          </Button>
        </form>

        <div className="glass-strong rounded-2xl p-4 mb-6 animate-slide-in-bottom overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading scores...</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No scores yet. Be the first!</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="w-12 text-muted-foreground">#</TableHead>
                  <TableHead className="text-muted-foreground">Player</TableHead>
                  <TableHead className="text-center text-muted-foreground">Score</TableHead>
                  <TableHead className="text-muted-foreground">Category</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry, i) => {
                  const isEditing = editingId === entry.id;
                  return (
                    <TableRow key={entry.id} className="border-border/30 hover:bg-primary/5">
                      <TableCell className="py-3">{getRankIcon(i)}</TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {isEditing ? (
                          <Input
                            value={editValues.player_name}
                            onChange={(e) => setEditValues({ ...editValues, player_name: e.target.value })}
                            className="h-8"
                          />
                        ) : (
                          entry.player_name
                        )}
                      </TableCell>
                      <TableCell className="text-center font-bold text-foreground">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editValues.score}
                            onChange={(e) => setEditValues({ ...editValues, score: e.target.value })}
                            className="h-8 w-20 mx-auto"
                          />
                        ) : (
                          `${entry.score}/${entry.total_questions}`
                        )}
                      </TableCell>
                      <TableCell className="text-primary">
                        {isEditing ? (
                          <Input
                            value={editValues.category}
                            onChange={(e) => setEditValues({ ...editValues, category: e.target.value })}
                            className="h-8"
                          />
                        ) : (
                          entry.category
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(entry.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {isEditing ? (
                            <>
                              <Button size="icon" variant="ghost" onClick={() => entry.id && saveEdit(entry.id)}>
                                <Check className="h-4 w-4 text-green-400" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={cancelEdit}>
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="icon" variant="ghost" onClick={() => startEdit(entry)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => entry.id && setDeleteId(entry.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-400" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        <Button
          onClick={onBack}
          variant="outline"
          className="w-full h-12 rounded-xl border-border/50 text-foreground hover:bg-primary/10 font-semibold animate-slide-in-bottom"
          style={{ animationDelay: '0.2s' }}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Quiz
        </Button>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Leaderboard;
