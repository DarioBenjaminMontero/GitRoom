import { useState} from "react";
import axios from  'axios'
import { useNavigate, Link } from "react-router-dom";
import '../NewRepository.css'
export default function NewRepository(){



return(
<>

<form id="createRepoForm">
    <div class="gh-section-step">
        <span class="step-number">1</span>
        <div class="step-title-group">
            <h2>General</h2>
            <p class="step-desc">Configura el propietario y el nombre clave de tu proyecto.</p>
        </div>
    </div>

    <div class="gh-row-inputs">
        <div class="input-group">
            <label for="owner">Propietario <span class="required">*</span></label>
            <div class="select-owner">
                <img src="https://avatars.githubusercontent.com/u/9919?v=4" alt="User"/>
                <span class="owner-name">DarioBenjaminMontero</span>
            </div>
        </div>

        <span class="slash-separator">/</span>

        <div class="input-group flex-grow">
            <label for="repoName">Nombre del repositorio <span class="required">*</span></label>
            <input type="text" id="repoName" name="repoName" placeholder="ej. super-proyecto-ia" required autocomplete="off"/>
            <div class="input-feedback" id="nameFeedback">¡Excelente nombre para destacar!</div>
        </div>
    </div>

    <div class="input-group full-width">
        <label for="description">Descripción <span class="optional">(opcional)</span></label>
        <textarea id="description" name="description" rows="3" placeholder="¿De qué trata este proyecto asombroso?" maxlength="350"></textarea>
        <div class="char-counter"><span>350</span> caracteres restantes</div>
    </div>

    <hr class="gh-divider"></hr>

    <div class="gh-section-step">
        <span class="step-number">2</span>
        <div class="step-title-group">
            <h2>Visibilidad</h2>
            <p class="step-desc">Elige quién puede ver, inspeccionar y contribuir en este repositorio.</p>
        </div>
    </div>

    <div class="visibility-options">
        <label class="visibility-card active" id="publicCard">
            <input type="radio" name="visibility" value="public" checked></input>
            <div class="visibility-icon-container">
                <svg aria-hidden="true" height="20" viewBox="0 0 16 16" version="1.1" width="20" data-view-component="true" class="octicon octicon-repo"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path></svg>
            </div>
            <div class="visibility-info">
                <span class="vis-title">Público</span>
                <span class="vis-desc">Cualquier persona en internet puede ver este repositorio. Tú eliges quién puede colaborar.</span>
            </div>
        </label>

        <label class="visibility-card" id="privateCard">
            <input type="radio" name="visibility" value="private"></input>
            <div class="visibility-icon-container">
                <svg aria-hidden="true" height="20" viewBox="0 0 16 16" version="1.1" width="20" data-view-component="true" class="octicon octicon-lock"><path d="M4 4v2h-.25A1.75 1.75 0 0 0 2 7.75v5.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0 0 14 13.25v-5.5A1.75 1.75 0 0 0 12.25 6H12V4a4 4 0 1 0-8 0Zm6 2V4a2 2 0 1 0-4 0v2ZM3.75 7.5h8.5a.25.25 0 0 1 .25.25v5.5a.25.25 0 0 1-.25.25h-8.5a.25.25 0 0 1-.25-.25v-5.5a.25.25 0 0 1 .25-.25Z"></path></svg>
            </div>
            <div class="visibility-info">
                <span class="vis-title">Privado</span>
                <span class="vis-desc">Tú y los colaboradores que elijas tendrán acceso exclusivo para ver y editar este repositorio.</span>
            </div>
        </label>
    </div>

    <hr class="gh-divider"></hr>

    <div class="form-actions">
        <button type="submit" class="btn-gh-success">
            Crear repositorio con estilo
        </button>
    </div>
</form>

</>
)
}