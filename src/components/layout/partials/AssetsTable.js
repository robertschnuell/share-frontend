import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const AssetsTable = ({ assets }) => {
  if (!assets || Object.keys(assets).length === 0) return null;

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return "";
    return d.toLocaleDateString();
  };

  return (
    <>
      <div className="mb-3 font-semibold text-muted">assets</div>
      <Card className="rounded-xl border border-muted bg-background p-4 md:p-6 flex-1 h-full min-h-0">
        <div className="h-full min-h-0 max-h-[30vh] md:max-h-full overflow-y-auto">
          <div className="w-full overflow-x-auto">
            <Table className="text-sm text-foreground">
              <TableBody>
                {Object.values(assets).map((asset) => (
                  <TableRow
                    key={asset.id}
                    className="border-b border-b-0 cursor-pointer pl-0 hover:bg-muted"
                    onClick={() => window.open(asset.url, "_blank")}
                  >
                    <TableCell className="px-0 py-1 text-foreground">
                      {(asset.name || asset.filename) + (asset.extension ? `.${asset.extension}` : "")}
                    </TableCell>
                    <TableCell className="px-2 py-1 text-foreground">
                      {formatDate(asset.modified)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </>
  );
};

export default AssetsTable;
