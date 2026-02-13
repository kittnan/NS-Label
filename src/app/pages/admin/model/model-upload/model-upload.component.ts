import { Component } from '@angular/core';
import { HttpModelService } from 'src/app/http/http-model.service';
import Swal from 'sweetalert2';

interface ParsedTxtData {
  SO: string;
  seiden: string;
  internalModel: string;
}

interface ParsedTsvData {
  seiden: string;
  modelName: string;
  po: string;
}

interface ResultRow {
  index: number;
  SO: string;
  internalModel: string;
  partName: string;
  seiden: string;
  modelName: string;
  type: string;
  remark1: string;
  remark2: string;
  remark3: string;
  po: string;
  unit: string;
  hasPartName: boolean; // Flag to identify if row has valid part name
  edited?: boolean;
}

@Component({
  selector: 'app-model-upload',
  templateUrl: './model-upload.component.html',
  styleUrls: ['./model-upload.component.scss']
})
export class ModelUploadComponent {
  //  API service
  constructor(
    private $model: HttpModelService
  ) { }
  // File storage
  tsvFile: File | null = null;
  txtFile: File | null = null;

  // Result data
  resultData: ResultRow[] = [];
  resultWithPartName: ResultRow[] = [];
  resultWithoutPartName: ResultRow[] = [];
  displayedColumns: string[] = ['index', 'SO', 'internalModel', 'partName', 'seiden', 'modelName', 'type', 'remark1', 'remark2', 'remark3', 'po', 'unit', 'status'];

  // State management
  isComparing: boolean = false;
  isSubmitting: boolean = false;
  isFetchingPartNames: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Custom conditions with default values
  customConditions = {
    remark1: 'ITCP',
    remark2: 'NSPL',
    remark3: 'TFT PANEL UNIT',
    unit: 'TFT PANEL UNIT'
  };

  // TSV Filter conditions (dynamic array)
  filterConditions: Array<{ column: string; value: string; operator: 'OR' | 'AND' }> = [
    { column: 'AG', value: 'N3893', operator: 'OR' },
    { column: 'AH', value: 'NIPPON SEIKI POLAND', operator: 'OR' }
  ];

  // Parsed file content
  private tsvData: ParsedTsvData[] = [];
  private txtData: ParsedTxtData[] = [];

  // Raw file content (to re-parse with updated filters)
  private rawTsvContent: string = '';
  private rawTxtContent: string = '';

  // Column mapping configuration
  private readonly TXT_COLUMN_MAP = {
    'SO#': 'SO',
    'Cust Remarks': 'seiden',
    'Prod Part#': 'internalModel',
    'Customer SO#': 'seiden'
  };

  private readonly TSV_COLUMN_MAP = {
    'C': 'seiden',
    'BN': 'modelName',
    'FJ': 'po',
    'BE': 'modelName'
  };

  /**
   * Handle file selection
   */
  onFileSelect(event: Event, fileType: 'tsv' | 'txt'): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.errorMessage = '';
    this.successMessage = '';

    // Validate file type
    if (fileType === 'tsv' && !file.name.toLowerCase().endsWith('.tsv')) {
      this.errorMessage = 'Please select a valid .tsv file';
      return;
    }

    if (fileType === 'txt' && !file.name.toLowerCase().endsWith('.txt')) {
      this.errorMessage = 'Please select a valid .txt file';
      return;
    }

    // Store the file
    if (fileType === 'tsv') {
      this.tsvFile = file;
      this.readFile(file, 'tsv');
    } else {
      this.txtFile = file;
      this.readFile(file, 'txt');
    }
  }

  /**
   * Read file content
   */
  private readFile(file: File, fileType: 'tsv' | 'txt'): void {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;

        if (fileType === 'tsv') {
          this.rawTsvContent = content;
          this.tsvData = this.parseTsvToStructured(content);
          console.log('TSV Data:', this.tsvData);
        } else {
          this.rawTxtContent = content;
          this.txtData = this.parseTxtToStructured(content);
          console.log('TXT Data:', this.txtData);
        }
      } catch (error) {
        this.errorMessage = `Error parsing ${fileType.toUpperCase()} file: ${(error as Error).message}`;
      }
    };

    reader.onerror = () => {
      this.errorMessage = `Error reading ${fileType.toUpperCase()} file`;
    };

    reader.readAsText(file);
  }

  /**
   * Parse TSV file to structured data
   * Skip first 2 lines and map to required fields
   * Filter by column AG = 'N3893' OR column AH = 'NIPPON SEIKI POLAND'
   */
  private parseTsvToStructured(content: string): ParsedTsvData[] {
    const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');

    if (lines.length <= 2) {
      return [];
    }

    // Skip first 2 lines
    const dataLines = lines.slice(2);

    if (dataLines.length === 0) {
      return [];
    }

    // Get number of columns from first data line
    const firstDataLine = dataLines[0].split('\t');
    const columnCount = firstDataLine.length;

    // Generate Excel-like column headers (A, B, C, ... Z, AA, AB, ...)
    const headers = this.generateExcelColumns(columnCount);
    const result: ParsedTsvData[] = [];

    // Parse data lines and extract only required fields
    for (let i = 0; i < dataLines.length; i++) {
      const values = dataLines[i].split('\t');
      const rowData: any = {};

      headers.forEach((header, index) => {
        rowData[header] = values[index] ? values[index].trim() : '';
      });

      // Filter condition: Dynamic filter with AND/OR operators
      let matchesFilter = false;

      // Get valid filters (both column and value are not empty)
      const validFilters = this.filterConditions.filter(f =>
        f.column && f.column.trim() !== '' &&
        f.value && f.value.trim() !== ''
      );

      // If no valid filters, include all rows
      if (validFilters.length === 0) {
        matchesFilter = true;
      } else {
        // Evaluate filters with AND/OR logic
        matchesFilter = true; // Start with true for AND logic
        let hasOrCondition = false;
        let orConditionMet = false;

        for (const filter of validFilters) {
          const columnName = filter.column.trim().toUpperCase();
          const columnValue = rowData[columnName] || '';
          const filterValue = filter.value.trim();
          const isMatch = columnValue === filterValue;

          if (filter.operator === 'OR') {
            hasOrCondition = true;
            if (isMatch) {
              orConditionMet = true;
            }
          } else {
            // AND operator
            if (!isMatch) {
              matchesFilter = false;
              break; // If any AND condition fails, skip this row
            }
          }
        }

        // If we have OR conditions, at least one must match
        if (hasOrCondition && !orConditionMet) {
          matchesFilter = false;
        }
      }

      if (matchesFilter) {
        // Extract mapped fields (keep raw PO value)
        const parsedRow: ParsedTsvData = {
          seiden: rowData['C'] || '',
          modelName: rowData['BN'] || rowData['BE'] || '', // BN or BE
          po: rowData['FJ'] || ''
        };

        result.push(parsedRow);
      }
    }

    const validFilters = this.filterConditions.filter(f =>
      f.column && f.column.trim() !== '' &&
      f.value && f.value.trim() !== ''
    );
    const filterMsg = validFilters.map(f => `${f.operator === 'AND' ? '(' : ''}${f.column}='${f.value}'${f.operator === 'AND' ? ')' : ''}`);
    const filterDesc = filterMsg.length > 0 ? filterMsg.join(' ') : 'No filter';
    console.log(`Filtered ${result.length} rows from TSV where ${filterDesc}`);

    return result;
  }

  /**
   * Generate Excel-like column names (A, B, C, ..., Z, AA, AB, ...)
   */
  private generateExcelColumns(count: number): string[] {
    const columns: string[] = [];

    for (let i = 0; i < count; i++) {
      let columnName = '';
      let num = i;

      while (num >= 0) {
        columnName = String.fromCharCode(65 + (num % 26)) + columnName;
        num = Math.floor(num / 26) - 1;
      }

      columns.push(columnName);
    }

    return columns;
  }

  /**
   * Clean PO value by extracting only "PO" followed by numbers
   */
  private cleanPOValue(po: string): string {
    if (!po) return '';

    // Extract PO followed by numbers (e.g., PON123456)
    const match = po.match(/PON\d+/i);
    return match ? match[0].toUpperCase() : '';
  }

  /**
   * Parse TXT file to structured data
   * Map columns according to configuration
   */
  private parseTxtToStructured(content: string): ParsedTxtData[] {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(content);
      const dataArray = Array.isArray(parsed) ? parsed : [parsed];

      return dataArray.map(item => ({
        SO: item['SO#'] || item['SO'] || '',
        seiden: item['Cust Remarks'] || item['Customer SO#'] || item['seiden'] || '',
        internalModel: item['Prod Part#'] || item['internalModel'] || ''
      }));
    } catch {
      // If not JSON, try to parse as tab-separated format
      const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');

      if (lines.length === 0) {
        return [];
      }

      // Check if first line contains tabs (header line)
      if (lines[0].includes('\t')) {
        const headers = lines[0].split('\t').map(h => h.trim());
        const result: ParsedTxtData[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split('\t');
          const rowData: any = {};

          headers.forEach((header, index) => {
            rowData[header] = values[index] ? values[index].trim() : '';
          });

          // Map to structured data
          result.push({
            SO: rowData['SO#'] || rowData['SO'] || '',
            seiden: rowData['Cust Remarks'] || rowData['Customer SO#'] || '',
            internalModel: rowData['Prod Part#'] || rowData['internalModel'] || ''
          });
        }

        return result;
      } else {
        return [];
      }
    }
  }

  /**
   * Compare and join the two files
   */
  compareFiles(): void {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';
    this.resultData = [];

    // Validate files are loaded
    if (!this.tsvFile || !this.txtFile) {
      this.errorMessage = 'Please upload both TSV and TXT files';
      return;
    }

    if (!this.rawTsvContent || !this.rawTxtContent) {
      this.errorMessage = 'Files are empty or still loading. Please wait and try again.';
      return;
    }

    // Re-parse TSV with current filter conditions
    this.tsvData = this.parseTsvToStructured(this.rawTsvContent);
    console.log('Re-parsed TSV Data with current filters:', this.tsvData);

    if (this.tsvData.length === 0 || this.txtData.length === 0) {
      this.errorMessage = 'No data matches the filter conditions or files are empty.';
      Swal.fire({
        icon: 'warning',
        title: 'No Data to Compare',
        text: 'No data matches the filter conditions or files are empty. Please adjust filters or check file content.',
      });
      return;
    };


    this.isComparing = true;

    // Use setTimeout to allow UI to update
    setTimeout(async () => {
      try {
        // Join data by seiden
        const joinedData = this.joinDataBySeiden();

        // Clean PO values after join
        joinedData.forEach(row => {
          row.po = this.cleanPOValue(row.po);
        });

        console.log('Joined data with cleaned PO:', joinedData);

        // Filter only rows with po
        const filteredData = joinedData.filter(row => row.po && row.po.trim() !== '');
        if(filteredData.length === 0){
          this.errorMessage = 'No data with valid PO found after joining files.';
          Swal.fire({
            icon: 'warning',
            title: 'No Valid PO Found',
            text: 'No data with valid PO found after joining files. Please check the TXT and TSV file contents.',
          }).then(() => {
            this.isComparing = false;
            location.reload();
          })
        }
        console.log('Joined and filtered data:', filteredData);

        // Fetch part names from API
        this.isFetchingPartNames = true;
        await this.fetchPartNames(filteredData);
        this.isFetchingPartNames = false;

        // Remove duplicates by internalModel and seiden
        const distinctData = this.getDistinctByInternalModelAndSeiden(filteredData);
        console.log(`Removed ${filteredData.length - distinctData.length} duplicate rows. Remaining: ${distinctData.length}`);

        // Separate data into two groups
        const withPartName = distinctData.filter(row =>
          row.partName &&
          row.partName.trim() !== '' &&
          row.partName !== 'ERROR' &&
          row.partName !== 'NOT FOUND'
        );

        const withoutPartName = distinctData.filter(row =>
          !row.partName ||
          row.partName.trim() === '' ||
          row.partName === 'ERROR' ||
          row.partName === 'NOT FOUND'
        );

        // Mark each row with hasPartName flag
        withPartName.forEach(row => row.hasPartName = true);
        withoutPartName.forEach(row => row.hasPartName = false);

        // Combine both groups
        const combinedData = [...withPartName, ...withoutPartName];

        // Re-index all rows
        combinedData.forEach((row, idx) => {
          row.index = idx + 1;
        });

        this.resultData = combinedData;
        this.resultWithPartName = withPartName;
        this.resultWithoutPartName = withoutPartName;

        console.log('Result with part names:', this.resultWithPartName);
        console.log('Result without part names:', this.resultWithoutPartName);

        this.successMessage = `Comparison complete! Found ${this.resultWithPartName.length} rows with Part Name and ${this.resultWithoutPartName.length} rows without Part Name.`;
      } catch (error) {
        this.errorMessage = 'Error comparing files: ' + (error as Error).message;
      } finally {
        this.isComparing = false;
        this.isFetchingPartNames = false;
      }
    }, 100);
  }

  /**
   * Join TXT and TSV data by seiden field
   */
  private joinDataBySeiden(): ResultRow[] {
    const result: ResultRow[] = [];
    let index = 1;

    // Loop through txt data
    for (const txtRow of this.txtData) {
      // Find matching tsv row by seiden
      const tsvRow = this.tsvData.find(tsv =>
        tsv.seiden && txtRow.seiden &&
        tsv.seiden.trim().toLowerCase() === txtRow.seiden.trim().toLowerCase()
      );

      if (tsvRow) {
        // Calculate type based on internalModel
        const type = this.calculateType(txtRow.internalModel);

        result.push({
          index: index++,
          SO: txtRow.SO,
          internalModel: txtRow.internalModel,
          partName: '', // Will be fetched from API
          seiden: txtRow.seiden,
          modelName: tsvRow.modelName,
          type: type,
          remark1: this.customConditions.remark1,
          remark2: this.customConditions.remark2,
          remark3: this.customConditions.remark3,
          po: tsvRow.po,
          unit: this.customConditions.unit,
          hasPartName: false,
          edited: false
        });
      }
    }

    return result;
  }

  /**
   * Get distinct rows by internalModel and seiden combination
   * Keeps the first occurrence of each unique combination
   */
  private getDistinctByInternalModelAndSeiden(rows: ResultRow[]): ResultRow[] {
    const seen = new Set<string>();
    const distinctRows: ResultRow[] = [];

    for (const row of rows) {
      // Create unique key from internalModel and seiden (case-insensitive)
      const key = `${row.internalModel?.trim().toLowerCase() || ''}_${row.seiden?.trim().toLowerCase() || ''}`;

      if (!seen.has(key)) {
        seen.add(key);
        distinctRows.push(row);
      }
    }

    return distinctRows;
  }

  /**
   * Calculate type based on internalModel
   * 4 digits = "mass", otherwise = "prelaunch"
   */
  private calculateType(internalModel: string): string {
    if (!internalModel) return 'prelaunch';

    // Extract only digits from internalModel
    const digits = internalModel.replace(/\D/g, '');

    return digits.length === 4 ? 'mass' : 'prelaunch';
  }

  /**
   * Fetch part names from API for all rows
   * Groups by unique internalModel to reduce API calls
   */
  private async fetchPartNames(rows: ResultRow[]): Promise<void> {
    try {
      // Get unique internalModels
      const uniqueInternalModels = [...new Set(
        rows
          .map(row => row.internalModel)
          .filter(model => model && model.trim() !== '')
      )];

      if (uniqueInternalModels.length === 0) {
        return;
      }

      console.log('Fetching part names for unique models:', uniqueInternalModels);

      // TODO: Replace with actual API call - send array of internalModels
      const response = await this.$model.getModelInLT({ modelLT: uniqueInternalModels }).toPromise();

      console.log(`⚡ ~ :385 ~ ModelUploadComponent ~ response:`, response);

      // Convert array of objects to single object map
      const partNameMap: { [key: string]: string } = {};

      response.data.forEach((item: any) => {
        if (item.INDIV_CD && item.MEMO12) {
          partNameMap[item.INDIV_CD] = item.MEMO12;
        }
      });

      console.log(`⚡ ~ :393 ~ ModelUploadComponent ~ partNameMap:`, partNameMap);


      // Simulate API call with batch request
      // const partNameMap = await this.simulateBatchPartNameAPI(uniqueInternalModels);

      // Map part names back to all rows
      rows.forEach(row => {
        if (row.internalModel) {
          console.log(row.internalModel, partNameMap[row.internalModel]);

          row.partName = partNameMap[row.internalModel] || 'NOT FOUND';
        } else {
          row.partName = '';
        }
      });

      console.log(`⚡ ~ :423 ~ ModelUploadComponent ~ rows:`, rows);


      console.log('Part names fetched successfully');
    } catch (error) {
      console.error('Error fetching part names:', error);
      // Set error message for all rows
      rows.forEach(row => {
        row.partName = 'ERROR';
      });
      throw error;
    }
  }

  /**
   * Simulate batch API call for part names
   * TODO: Replace with actual API implementation
   */
  private async simulateBatchPartNameAPI(internalModels: string[]): Promise<{ [key: string]: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock response - map each internalModel to a part name
    const result: { [key: string]: string } = {};

    internalModels.forEach(model => {
      // TODO: Replace with actual API call
      result[model] = `PART_${model}_NAME`;
    });

    return result;
  }

  /**
   * Handle cell edit
   */
  onCellEdit(row: ResultRow, field: keyof ResultRow): void {
    row.edited = true;

    // Recalculate type if internalModel is changed
    if (field === 'internalModel') {
      row.type = this.calculateType(row.internalModel);
    }
  }

  /**
   * Submit the result (only rows with valid partName)
   */
  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Filter only rows with valid part names
    const validRows = this.resultData.filter(row => row.hasPartName);

    if (validRows.length === 0) {
      this.errorMessage = 'No valid data to submit. All rows are missing Part Names.';
      return;
    }

    this.isSubmitting = true;

    this.$model.createCompare({ data: validRows }).subscribe({
      next: (response) => {
        console.log('Submission response:', response);
        this.successMessage = `Data submitted successfully! ${validRows.length} rows submitted, ${this.resultWithoutPartName.length} rows skipped.`;
      },
      error: (error) => {
        console.error('Error submitting data:', error);
        this.errorMessage = 'Error submitting data: ' + (error.message || 'Unknown error');
      },
      complete: () => {
        this.isSubmitting = false;
        Swal.fire({
          icon: 'success',
          title: 'Submission Complete',
          text: `Data submitted successfully! ${validRows.length} rows submitted, ${this.resultWithoutPartName.length} rows skipped.`,
        }).then(() => {
          // Optionally reset the component after submission
          this.reset();
        });
      }
    });


    // // Simulate API call
    // setTimeout(() => {
    //   try {
    //     // Prepare data for submission
    //     const submitData = {
    //       timestamp: new Date().toISOString(),
    //       totalRows: validRows.length,
    //       editedRows: validRows.filter(r => r.edited).length,
    //       skippedRows: this.resultWithoutPartName.length,
    //       data: validRows.map(row => ({
    //         SO: row.SO,
    //         internalModel: row.internalModel,
    //         partName: row.partName,
    //         seiden: row.seiden,
    //         modelName: row.modelName,
    //         type: row.type,
    //         remark1: row.remark1,
    //         remark2: row.remark2,
    //         remark3: row.remark3,
    //         po: row.po,
    //         unit: row.unit
    //       }))
    //     };

    //     console.log('Submitting data:', submitData);

    //     // TODO: Replace with actual API call
    //     // this.httpService.submitResult(submitData).subscribe(...)

    //     this.successMessage = `Data submitted successfully! ${validRows.length} rows submitted, ${this.resultWithoutPartName.length} rows skipped.`;
    //   } catch (error) {
    //     this.errorMessage = 'Error submitting data: ' + (error as Error).message;
    //   } finally {
    //     this.isSubmitting = false;
    //   }
    // }, 1000);
  }

  /**
   * Reset the component
   */
  reset(): void {
    this.tsvFile = null;
    this.txtFile = null;
    this.tsvData = [];
    this.txtData = [];
    this.rawTsvContent = '';
    this.rawTxtContent = '';
    this.resultData = [];
    this.resultWithPartName = [];
    this.resultWithoutPartName = [];
    this.errorMessage = '';
    this.successMessage = '';
    this.isComparing = false;
    this.isSubmitting = false;
    this.isFetchingPartNames = false;
    // Reset custom conditions to default
    this.customConditions = {
      remark1: 'ITCP',
      remark2: 'NSPL',
      remark3: 'TFT PANEL UNIT',
      unit: 'TFT PANEL UNIT'
    };
    // Reset filter conditions to default
    this.filterConditions = [
      { column: 'AG', value: 'N3893', operator: 'OR' },
      { column: 'AH', value: 'NIPPON SEIKI POLAND', operator: 'OR' }
    ];
  }

  /**
   * Add new filter condition
   */
  addFilterCondition(): void {
    this.filterConditions.push({ column: '', value: '', operator: 'OR' });
  }

  /**
   * Remove filter condition at index
   */
  removeFilterCondition(index: number): void {
    if (this.filterConditions.length > 1) {
      this.filterConditions.splice(index, 1);
    }
  }
}
