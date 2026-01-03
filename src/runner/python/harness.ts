export const PYTHON_HARNESS = `
import sys
import json
import traceback

# Global state to hold the solution instance if needed, 
# but usually we re-instantiate or just call the method.

def _run_leetcode_case(code_exec_success, method_name, args_lines):
    if not code_exec_success:
        return {"error": "User code failed to execute (syntax error?)"}

    # Ensure Solution class exists
    if 'Solution' not in globals():
        return {"error": "Class 'Solution' not found. Please define class Solution."}
    
    try:
        sol_class = globals()['Solution']
        sol = sol_class()
        
        # Find method
        if not hasattr(sol, method_name):
            return {"error": f"Method '{method_name}' not found in Solution class."}
        
        method = getattr(sol, method_name)
        
        # Parse args
        args = []
        for line in args_lines.split('\\n'):
            if line.strip():
                try:
                    args.append(json.loads(line))
                except json.JSONDecodeError as e:
                    return {"error": f"Invalid JSON in arguments: {str(e)}"}
        
        # Call method
        result = method(*args)
        
        # Render result
        try:
            # Try to serialize to JSON to be unambiguous
            actual = json.dumps(result, ensure_ascii=False)
        except (TypeError, OverflowError):
            # Fallback to string representation
            actual = str(result)
            
        return {"passed": True, "actual": actual}
        
    except Exception:
        return {"error": traceback.format_exc()}
`;

