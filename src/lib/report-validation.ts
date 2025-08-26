// Quick validation utility for the new report system
import { REPORT_TEMPLATES } from './report-templates';

export const validateReportSystem = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate template IDs are unique
  const templateIds = REPORT_TEMPLATES.map(t => t.id);
  const uniqueIds = new Set(templateIds);
  if (templateIds.length !== uniqueIds.size) {
    errors.push('IDs de templates duplicados encontrados');
  }

  // Validate template structure
  REPORT_TEMPLATES.forEach(template => {
    if (!template.id || !template.name || !template.description) {
      errors.push(`Template "${template.name || 'sem nome'}" está incompleto`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Development helper
export const logValidationResults = () => {
  const result = validateReportSystem();
  
  if (result.isValid) {
    console.log('✅ Sistema de relatórios validado com sucesso!');
    console.log(`📊 ${REPORT_TEMPLATES.length} templates disponíveis`);
  } else {
    console.error('❌ Problemas encontrados no sistema de relatórios:');
    result.errors.forEach(error => console.error(`  - ${error}`));
  }
  
  return result;
};