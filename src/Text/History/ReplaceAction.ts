module Fayde.Text.History {
    export class ReplaceAction implements IAction {
        SelectionAnchor: number;
        SelectionCursor: number;
        Start: number;
        Length: number;
        Deleted: string;
        Inserted: string;

        constructor (selectionAnchor: number, selectionCursor: number, buffer: string, start: number, length: number, inserted: string) {
            this.SelectionAnchor = selectionAnchor;
            this.SelectionCursor = selectionCursor;
            this.Start = start;
            this.Length = length;
            this.Deleted = buffer.substr(start, length);
            this.Inserted = inserted;
        }

        Undo (bo: ITextOwner) {
            bo.text = TextBuffer.Cut(bo.text, this.Start, this.Inserted.length);
            bo.text = Text.TextBuffer.Insert(bo.text, this.Start, this.Deleted);
        }

        Redo (bo: ITextOwner): number {
            bo.text = TextBuffer.Cut(bo.text, this.Start, this.Length);
            bo.text = TextBuffer.Insert(bo.text, this.Start, this.Inserted);
            return this.Start + this.Inserted.length;
        }
    }
}